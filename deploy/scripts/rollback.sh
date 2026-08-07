#!/usr/bin/env bash
#
# Return one or more apps to the image tag they ran before the last deploy.
#
#   deploy/scripts/rollback.sh api
#   deploy/scripts/rollback.sh --to 1.3.2 api
#   deploy/scripts/rollback.sh api dashboard tenant-web landing
#
# Without --to, the tag comes from deploy/.env.images.previous, which deploy.sh
# writes before every rollout.
#
# Migrations are NEVER re-run and never reversed. Rolling code back over a
# forward-migrated database is the deliberate trade: it is recoverable, an
# automated `migrate:rollback` on live tenant data is not. If the bad release
# shipped a destructive migration, restore from backup instead — see
# docs/06_RUNBOOK.md and docs/adr/0006-rollback-image-bukan-migration.md.

# shellcheck source=./lib.sh
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

TARGET_TAG=''
APPS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --to) TARGET_TAG="${2:?--to needs a tag}"; shift 2 ;;
    -h | --help)
      sed -n '2,18p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*) die "unknown option '$1'" ;;
    *) APPS+=("$1"); shift ;;
  esac
done

[ "${#APPS[@]}" -gt 0 ] || die 'no app specified (try --help)'

for app in "${APPS[@]}"; do
  is_known_app "${app}" || die "unknown app '${app}'"
done

require_stack

# Resolve every target up front from a frozen copy: each deploy.sh call
# rewrites .env.images.previous, so reading it lazily inside the loop would
# make the second app roll back to the wrong tag.
PLAN_SNAPSHOT=''
if [ -z "${TARGET_TAG}" ]; then
  [ -f "${IMAGES_PREVIOUS_FILE}" ] \
    || die "no ${IMAGES_PREVIOUS_FILE}; specify the tag explicitly with --to"
  PLAN_SNAPSHOT="$(mktemp)"
  # shellcheck disable=SC2064 # expand the path now, while it still exists
  trap "rm -f '${PLAN_SNAPSHOT}'" EXIT
  cp "${IMAGES_PREVIOUS_FILE}" "${PLAN_SNAPSHOT}"
fi

PLAN_APPS=()
PLAN_TARGETS=()
PLAN_CURRENT=()

for app in "${APPS[@]}"; do
  now="$(current_tag "${app}")"

  if [ -n "${TARGET_TAG}" ]; then
    target="${TARGET_TAG}"
  else
    target="$(read_var "${PLAN_SNAPSHOT}" "$(tag_var_for "${app}")")"
    [ -n "${target}" ] || die "no previous tag recorded for ${app}; use --to"
  fi

  if [ "${target}" = "${now}" ]; then
    warn "${app} already runs ${now} — skipping"
    continue
  fi

  info "plan: ${app} ${now} -> ${target}"
  PLAN_APPS+=("${app}")
  PLAN_TARGETS+=("${target}")
  PLAN_CURRENT+=("${now}")
done

if [ "${#PLAN_APPS[@]}" -eq 0 ]; then
  ok 'nothing to roll back'
  exit 0
fi

for i in "${!PLAN_APPS[@]}"; do
  # deploy.sh does the pull, health gate and history logging. Migrations are
  # skipped on purpose (see the header).
  "${SCRIPT_DIR}/deploy.sh" \
    --tag "${PLAN_TARGETS[$i]}" \
    --no-migrate \
    --actor "${USER:-manual}/rollback" \
    --ref "rollback-from-${PLAN_CURRENT[$i]}" \
    "${PLAN_APPS[$i]}"
done

ok 'rollback finished'
log 'verify with: deploy/scripts/status.sh'
