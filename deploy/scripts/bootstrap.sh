#!/usr/bin/env bash
#
# Prepare this host (or a CI runner) to run the stack: create every config file
# that is intentionally kept out of Git, from its template.
#
#   deploy/scripts/bootstrap.sh          create missing files, never overwrite
#   deploy/scripts/bootstrap.sh --check  fail if anything is still a template
#
# Safe to re-run. Existing files are left exactly as they are.

# shellcheck source=./lib.sh
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

CHECK_ONLY=0
case "${1:-}" in
  --check) CHECK_ONLY=1 ;;
  '') ;;
  -h | --help)
    sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *) die "unknown option '$1'" ;;
esac

CREATED=0
PLACEHOLDERS=0

seed() { # seed <template> <destination>
  local template="$1" destination="$2"
  if [ ! -f "${template}" ]; then
    die "template not found: ${template}"
  fi
  if [ -f "${destination}" ]; then
    log "keep   $(realpath --relative-to="${REPO_ROOT}" "${destination}" 2>/dev/null || echo "${destination}")"
    return 0
  fi
  cp "${template}" "${destination}"
  # These files hold credentials. 0600 is not paranoia, it is the point.
  chmod 0600 "${destination}"
  ok "create $(realpath --relative-to="${REPO_ROOT}" "${destination}" 2>/dev/null || echo "${destination}")"
  CREATED=$((CREATED + 1))
}

info 'seeding host configuration from templates'

seed "${DEPLOY_DIR}/.env.example" "${ENV_FILE}"
seed "${DEPLOY_DIR}/.env.images.example" "${IMAGES_FILE}"

# apps/api owns its own environment contract — copy it rather than maintaining a
# second, divergent list of ~150 Laravel variables inside deploy/.
seed "${REPO_ROOT}/apps/api/.env.production.example" "${DEPLOY_DIR}/env/api.env"

for app in dashboard tenant-web landing; do
  seed "${DEPLOY_DIR}/env/${app}.env.example" "${DEPLOY_DIR}/env/${app}.env"
done

touch "${HISTORY_FILE}"

# --------------------------------------------------------------------------
# Warn about values that are obviously still templates. This is the single
# most common cause of a "successful" deploy that serves errors.
# --------------------------------------------------------------------------

flag() { warn "$1"; PLACEHOLDERS=$((PLACEHOLDERS + 1)); }

api_env="${DEPLOY_DIR}/env/api.env"

if [ -z "$(read_var "${api_env}" 'APP_KEY')" ]; then
  flag 'api.env: APP_KEY is empty — run: openssl rand -base64 32 (prefix with base64:)'
fi

if grep -qE '^(DB_PASSWORD|POSTGRES_PASSWORD)=change-this' "${api_env}" 2>/dev/null; then
  flag 'api.env: database password is still the template value'
fi

db_pass="$(read_var "${api_env}" 'DB_PASSWORD')"
pg_pass="$(read_var "${api_env}" 'POSTGRES_PASSWORD')"
if [ "${db_pass}" != "${pg_pass}" ]; then
  flag 'api.env: DB_PASSWORD and POSTGRES_PASSWORD differ — Laravel will not be able to connect'
fi

if grep -q 'replace-with-a' "${api_env}" 2>/dev/null; then
  flag 'api.env: REVERB_APP_KEY / REVERB_APP_SECRET still hold template values'
fi

if grep -q 'example\.com' "${api_env}" 2>/dev/null; then
  flag 'api.env: example.com placeholders are still present (APP_URL, CORS, domains)'
fi

if [ "$(read_var "${ENV_FILE}" 'REGISTRY')" = 'ghcr.io/sewantara' ]; then
  flag ".env: REGISTRY is still the example namespace — set it to your GHCR owner"
fi

echo
if [ "${CREATED}" -gt 0 ]; then
  ok "${CREATED} file(s) created"
fi

if [ "${PLACEHOLDERS}" -gt 0 ]; then
  warn "${PLACEHOLDERS} placeholder(s) still need real values"
  if [ "${CHECK_ONLY}" -eq 1 ]; then
    # In --check mode placeholders are informational: CI legitimately validates
    # the compose file with template values. Only a missing file is fatal.
    log '--check: placeholders tolerated'
  else
    log 'edit the files above, then run: deploy/scripts/deploy.sh --tag <tag> api dashboard tenant-web landing'
  fi
else
  ok 'no obvious placeholders left'
fi

if [ "${CHECK_ONLY}" -eq 1 ]; then
  info 'validating the compose file'
  compose config >/dev/null
  ok 'compose config is valid'
fi
