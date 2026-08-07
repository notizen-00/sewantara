#!/usr/bin/env bash
#
# Back up everything that cannot be rebuilt from Git: the PostgreSQL cluster
# (central schema + one schema per tenant) and the api_storage volume (tenant
# uploads, private media).
#
#   deploy/scripts/backup.sh                     -> deploy/backups/
#   deploy/scripts/backup.sh --out /mnt/backups
#   deploy/scripts/backup.sh --keep 14
#
# Images are NOT backed up: they are reproducible from a git tag via CI.
#
# A backup you have never restored is a rumour. Rehearse the restore path in
# docs/06_RUNBOOK.md on a staging host at least once a quarter.

# shellcheck source=./lib.sh
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

OUT_DIR="${DEPLOY_DIR}/backups"
KEEP_DAYS=14

while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT_DIR="${2:?--out needs a path}"; shift 2 ;;
    --keep) KEEP_DAYS="${2:?--keep needs a number of days}"; shift 2 ;;
    -h | --help)
      sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) die "unknown option '$1'" ;;
  esac
done

require_stack

STAMP="$(date -u '+%Y%m%dT%H%M%SZ')"
mkdir -p "${OUT_DIR}"
chmod 0700 "${OUT_DIR}"

api_env="${DEPLOY_DIR}/env/api.env"
PG_USER="$(read_var "${api_env}" 'POSTGRES_USER')"
PG_DB="$(read_var "${api_env}" 'POSTGRES_DB')"
[ -n "${PG_USER}" ] && [ -n "${PG_DB}" ] \
  || die "POSTGRES_USER / POSTGRES_DB missing from ${api_env}"

# --------------------------------------------------------------------------
# Database — custom format so pg_restore can do selective, parallel restores
# --------------------------------------------------------------------------

DB_FILE="${OUT_DIR}/postgres-${PG_DB}-${STAMP}.dump"
info "dumping database ${PG_DB}"
if compose exec -T postgres pg_dump -U "${PG_USER}" -d "${PG_DB}" -Fc >"${DB_FILE}"; then
  chmod 0600 "${DB_FILE}"
  ok "database -> ${DB_FILE} ($(du -h "${DB_FILE}" | cut -f1))"
else
  rm -f "${DB_FILE}"
  die 'pg_dump failed — nothing was written'
fi

# --------------------------------------------------------------------------
# Uploads — tar the named volume from a throwaway container
# --------------------------------------------------------------------------

STORAGE_FILE="${OUT_DIR}/api-storage-${STAMP}.tar.gz"

# Ask the running container which volume is mounted at the storage path — more
# reliable than reconstructing "<project>_api_storage" by hand.
VOLUME=''
api_cid="$(compose ps -q api 2>/dev/null | head -n1)"
if [ -n "${api_cid}" ]; then
  VOLUME="$(docker inspect -f \
    '{{range .Mounts}}{{if eq .Destination "/var/www/html/storage"}}{{.Name}}{{end}}{{end}}' \
    "${api_cid}" 2>/dev/null || true)"
fi
if [ -z "${VOLUME}" ]; then
  project="$(read_var "${ENV_FILE}" 'COMPOSE_PROJECT_NAME')"
  VOLUME="${project:-sewantara}_api_storage"
  warn "api container not running; assuming volume '${VOLUME}'"
fi

info 'archiving api_storage volume'
if docker run --rm \
  -v "${VOLUME}:/data:ro" \
  -v "${OUT_DIR}:/backup" \
  alpine:3.21 \
  tar -czf "/backup/$(basename "${STORAGE_FILE}")" -C /data .; then
  chmod 0600 "${STORAGE_FILE}"
  ok "uploads  -> ${STORAGE_FILE} ($(du -h "${STORAGE_FILE}" | cut -f1))"
else
  warn "could not archive volume '${VOLUME}' — check the name with: docker volume ls"
fi

# --------------------------------------------------------------------------
# Retention
# --------------------------------------------------------------------------

info "pruning backups older than ${KEEP_DAYS} days in ${OUT_DIR}"
find "${OUT_DIR}" -maxdepth 1 -type f \
  \( -name 'postgres-*.dump' -o -name 'api-storage-*.tar.gz' \) \
  -mtime "+${KEEP_DAYS}" -print -delete

echo
warn 'these files sit on the same host as the data they protect'
log  'copy them off-box (rclone / restic / provider snapshots) before you rely on them'
