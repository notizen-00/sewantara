#!/usr/bin/env bash
#
# Roll one or more apps out to this host.
#
#   deploy.sh --tag 1.4.0 api
#   deploy.sh --tag sha-9f3c… api dashboard tenant-web landing
#   deploy.sh --restart-only tenant-web        # config change, same image
#
# The host never builds. It pulls the image CI already produced, runs
# migrations from that exact image, recreates the containers, then waits for
# every healthcheck. A failed health gate rolls the image tags back
# automatically (set AUTO_ROLLBACK=0 in deploy/.env to keep the wreckage for
# inspection instead).
#
# Called by .github/workflows/reusable-deploy.yml over SSH, and safe to run by
# hand on the server.

# shellcheck source=./lib.sh
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

TAG=''
ACTOR="${USER:-manual}"
REF=''
RUN_URL=''
RUN_MIGRATIONS=1
RESTART_ONLY=0
PULL=1
APPS=()

usage() {
  cat <<'USAGE'
Usage: deploy.sh --tag <image-tag> [options] <app>...

Apps: api dashboard tenant-web landing

Options:
  --tag <tag>       Image tag to roll out (release version or sha-<sha>).
                    Required unless --restart-only.
  --restart-only    Recreate containers with the tag already deployed. Use
                    after editing deploy/env/<app>.env.
  --no-migrate      Skip API migrations and the EngineSeeder.
  --no-pull         Do not contact the registry (image must already be local).
  --actor <name>    Who triggered this, recorded in .deploy-history.log.
  --ref <git-ref>   Commit or tag being shipped, recorded in the history log.
  --run-url <url>   CI run URL, recorded in the history log.
  -h, --help        Show this help.

Examples:
  deploy.sh --tag 1.4.0 api
  deploy.sh --tag sha-9f3cb2… --no-migrate api dashboard
  deploy.sh --restart-only landing
USAGE
}

while [ $# -gt 0 ]; do
  case "$1" in
    --tag) TAG="${2:?--tag needs a value}"; shift 2 ;;
    --actor) ACTOR="${2:?--actor needs a value}"; shift 2 ;;
    --ref) REF="${2:?--ref needs a value}"; shift 2 ;;
    --run-url) RUN_URL="${2:?--run-url needs a value}"; shift 2 ;;
    --no-migrate) RUN_MIGRATIONS=0; shift ;;
    --restart-only) RESTART_ONLY=1; shift ;;
    --no-pull) PULL=0; shift ;;
    -h | --help) usage; exit 0 ;;
    -*) die "unknown option '$1' (try --help)" ;;
    *) APPS+=("$1"); shift ;;
  esac
done

if [ "${#APPS[@]}" -eq 0 ]; then
  usage >&2
  die 'no app specified'
fi

for app in "${APPS[@]}"; do
  is_known_app "${app}" \
    || die "unknown app '${app}' (expected one of: ${ALL_APPS[*]})"
done

if [ "${RESTART_ONLY}" -eq 0 ] && [ -z "${TAG}" ]; then
  die '--tag is required (or use --restart-only)'
fi

require_stack
acquire_lock

# Rollout knobs live next to the rest of the host config.
HEALTH_TIMEOUT="$(read_var "${ENV_FILE}" 'HEALTH_TIMEOUT')"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"
AUTO_ROLLBACK="$(read_var "${ENV_FILE}" 'AUTO_ROLLBACK')"
AUTO_ROLLBACK="${AUTO_ROLLBACK:-1}"

REGISTRY_NS="$(registry)"
[ -n "${REGISTRY_NS}" ] || die "REGISTRY is not set in ${ENV_FILE}"

collect_services SERVICES services_for "${APPS[@]}"
collect_services HEALTH_SERVICES health_services_for "${APPS[@]}"

info "apps:      ${APPS[*]}"
info "services:  ${SERVICES[*]}"
if [ "${RESTART_ONLY}" -eq 1 ]; then
  info 'mode:      restart-only (image tags unchanged)'
else
  info "tag:       ${TAG}"
fi

record_all() { # record_all <result>
  local app
  for app in "${APPS[@]}"; do
    history_append "$1" "${app}" "$(current_tag "${app}")" "${ACTOR}" "${REF}" "${RUN_URL}"
  done
}

rollback_and_fail() { # rollback_and_fail <message>
  err "$1"
  record_all 'FAILED'

  if [ "${RESTART_ONLY}" -eq 1 ]; then
    err 'restart-only rollout failed; there is no previous image to return to'
    exit 1
  fi
  if [ "${AUTO_ROLLBACK}" != '1' ]; then
    err 'AUTO_ROLLBACK=0 — leaving the failed rollout in place'
    err "roll back manually: deploy/scripts/rollback.sh ${APPS[*]}"
    exit 1
  fi

  warn 'rolling back to the previous image tags'
  restore_tags
  if compose up -d --remove-orphans "${SERVICES[@]}"; then
    record_all 'ROLLED_BACK'
    err 'rollback complete — the previous version is serving traffic again'
  else
    err 'ROLLBACK FAILED — manual intervention required, see docs/06_RUNBOOK.md'
  fi
  exit 1
}

trap registry_logout EXIT

# --------------------------------------------------------------------------
# 1. pull
# --------------------------------------------------------------------------

if [ "${RESTART_ONLY}" -eq 0 ]; then
  snapshot_tags

  for app in "${APPS[@]}"; do
    write_var "${IMAGES_FILE}" "$(tag_var_for "${app}")" "${TAG}"
    log "$(tag_var_for "${app}")=${TAG}"
  done

  if [ "${PULL}" -eq 1 ]; then
    registry_login
    info 'pulling images'
    compose pull "${SERVICES[@]}" \
      || die "pull failed — does tag '${TAG}' exist in ${REGISTRY_NS}?"
  else
    warn '--no-pull: using whatever is already in the local image store'
  fi
fi

# --------------------------------------------------------------------------
# 2. data stores first, so migrations have something to talk to
# --------------------------------------------------------------------------

info 'ensuring postgres and redis are up'
compose up -d postgres redis
wait_healthy 120 postgres redis || die 'data stores never became healthy'

# --------------------------------------------------------------------------
# 3. migrations — from the NEW image, before the app containers switch over
# --------------------------------------------------------------------------

if contains api "${APPS[@]}"; then
  if [ "${RUN_MIGRATIONS}" -eq 1 ]; then
    info 'running central + tenant migrations and the engine seeder'
    compose run --rm --no-deps api-migrate \
      || rollback_and_fail 'migrations failed; no container was replaced'
    ok 'migrations complete'
  else
    warn 'skipping migrations (--no-migrate)'
  fi
fi

# --------------------------------------------------------------------------
# 4. recreate
# --------------------------------------------------------------------------

info 'recreating containers'
compose up -d --remove-orphans "${SERVICES[@]}" \
  || rollback_and_fail 'compose up failed'

# --------------------------------------------------------------------------
# 5. health gate
# --------------------------------------------------------------------------

wait_healthy "${HEALTH_TIMEOUT}" "${HEALTH_SERVICES[@]}" \
  || rollback_and_fail 'health gate failed'

# --------------------------------------------------------------------------
# 6. record and tidy up
# --------------------------------------------------------------------------

record_all 'DEPLOYED'

info 'pruning dangling images'
docker image prune -f >/dev/null 2>&1 || true

summary=''
for app in "${APPS[@]}"; do
  summary="${summary}${app}=$(current_tag "${app}") "
done
ok "deployed: ${summary}"
log "history: ${HISTORY_FILE}"
