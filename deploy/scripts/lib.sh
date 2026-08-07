#!/usr/bin/env bash
# Shared helpers for the Sewantara deploy scripts. Sourced, never executed.
#
# Design rules:
#   - every compose invocation goes through compose() so the env files can
#     never be forgotten (a missing --env-file silently resolves image tags to
#     empty strings and pulls the wrong thing)
#   - the app -> services and app -> tag-variable maps live here only
#   - service lists are passed around as arrays, so nothing depends on
#     accidental word splitting
#   - nothing writes outside deploy/

# shellcheck shell=bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd -- "${DEPLOY_DIR}/.." && pwd)"

ENV_FILE="${DEPLOY_DIR}/.env"
IMAGES_FILE="${DEPLOY_DIR}/.env.images"
IMAGES_PREVIOUS_FILE="${DEPLOY_DIR}/.env.images.previous"
HISTORY_FILE="${DEPLOY_DIR}/.deploy-history.log"
LOCK_FILE="${DEPLOY_DIR}/.deploy.lock"

COMPOSE_FILE="${DEPLOY_DIR}/compose.yml"
COMPOSE_BUILD_FILE="${DEPLOY_DIR}/compose.build.yml"

ALL_APPS=(api dashboard tenant-web landing)

MIN_COMPOSE_VERSION='2.24.0'

# --------------------------------------------------------------------------
# Output
# --------------------------------------------------------------------------

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_RESET=$'\033[0m'; C_DIM=$'\033[2m'; C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_BLUE=$'\033[34m'
else
  C_RESET=''; C_DIM=''; C_RED=''; C_GREEN=''; C_YELLOW=''; C_BLUE=''
fi

_stamp() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }

log()  { printf '%s%s%s %s\n' "${C_DIM}" "$(_stamp)" "${C_RESET}" "$*"; }
info() { printf '%s%s%s %s==>%s %s\n' "${C_DIM}" "$(_stamp)" "${C_RESET}" "${C_BLUE}" "${C_RESET}" "$*"; }
ok()   { printf '%s%s%s %sOK%s   %s\n' "${C_DIM}" "$(_stamp)" "${C_RESET}" "${C_GREEN}" "${C_RESET}" "$*"; }
warn() { printf '%s%s%s %sWARN%s %s\n' "${C_DIM}" "$(_stamp)" "${C_RESET}" "${C_YELLOW}" "${C_RESET}" "$*" >&2; }
err()  { printf '%s%s%s %sERR%s  %s\n' "${C_DIM}" "$(_stamp)" "${C_RESET}" "${C_RED}" "${C_RESET}" "$*" >&2; }

die() { err "$*"; exit 1; }

# --------------------------------------------------------------------------
# App maps — the only place these relationships are defined
# --------------------------------------------------------------------------

is_known_app() {
  case "$1" in
    api | dashboard | tenant-web | landing) return 0 ;;
    *) return 1 ;;
  esac
}

# Every container that must be recreated when this app ships.
services_for() {
  case "$1" in
    api) echo 'api api-web api-queue api-scheduler api-reverb' ;;
    dashboard) echo 'dashboard' ;;
    tenant-web) echo 'tenant-web' ;;
    landing) echo 'landing' ;;
    *) die "unknown app '$1'" ;;
  esac
}

# Subset of services_for() that declares a healthcheck, i.e. that a rollout can
# actually wait on. Queue and scheduler have no meaningful readiness signal.
health_services_for() {
  case "$1" in
    api) echo 'api api-web api-reverb' ;;
    dashboard) echo 'dashboard' ;;
    tenant-web) echo 'tenant-web' ;;
    landing) echo 'landing' ;;
    *) die "unknown app '$1'" ;;
  esac
}

# The one container that represents the app to the outside world.
primary_service_for() {
  case "$1" in
    api) echo 'api-web' ;;
    dashboard) echo 'dashboard' ;;
    tenant-web) echo 'tenant-web' ;;
    landing) echo 'landing' ;;
    *) die "unknown app '$1'" ;;
  esac
}

tag_var_for() {
  case "$1" in
    api) echo 'API_IMAGE_TAG' ;;
    dashboard) echo 'DASHBOARD_IMAGE_TAG' ;;
    tenant-web) echo 'TENANT_WEB_IMAGE_TAG' ;;
    landing) echo 'LANDING_IMAGE_TAG' ;;
    *) die "unknown app '$1'" ;;
  esac
}

images_for() {
  case "$1" in
    api) echo 'sewantara-api sewantara-api-web' ;;
    dashboard) echo 'sewantara-dashboard' ;;
    tenant-web) echo 'sewantara-tenant-web' ;;
    landing) echo 'sewantara-landing' ;;
    *) die "unknown app '$1'" ;;
  esac
}

env_file_for() {
  case "$1" in
    api) echo 'api.env' ;;
    dashboard) echo 'dashboard.env' ;;
    tenant-web) echo 'tenant-web.env' ;;
    landing) echo 'landing.env' ;;
    *) die "unknown app '$1'" ;;
  esac
}

# Turn the space separated output of the map functions into an array, without
# relying on implicit word splitting.
#   collect_services SERVICES services_for api dashboard
collect_services() { # collect_services <array-name> <map-fn> <app>...
  local -n _out="$1"; shift
  local fn="$1"; shift
  local app
  local -a chunk=()
  _out=()
  for app in "$@"; do
    read -r -a chunk <<<"$("${fn}" "${app}")"
    _out+=("${chunk[@]}")
  done
}

contains() { # contains <needle> <haystack>...
  local needle="$1"; shift
  local item
  for item in "$@"; do
    if [ "${item}" = "${needle}" ]; then return 0; fi
  done
  return 1
}

# --------------------------------------------------------------------------
# Preflight
# --------------------------------------------------------------------------

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "'$1' is required but not installed"
}

version_at_least() { # version_at_least <have> <want>
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

require_stack() {
  require_cmd docker
  docker compose version >/dev/null 2>&1 \
    || die 'docker compose v2 plugin is required (docker-compose v1 is not supported)'

  local have
  have="$(docker compose version --short 2>/dev/null | tr -d 'v')"
  if [ -n "${have}" ] && ! version_at_least "${have}" "${MIN_COMPOSE_VERSION}"; then
    die "docker compose ${MIN_COMPOSE_VERSION}+ required for multiple --env-file (found ${have})"
  fi

  [ -f "${COMPOSE_FILE}" ] || die "missing ${COMPOSE_FILE}"
  [ -f "${ENV_FILE}" ] || die "missing ${ENV_FILE} — run deploy/scripts/bootstrap.sh"
  [ -f "${IMAGES_FILE}" ] || die "missing ${IMAGES_FILE} — run deploy/scripts/bootstrap.sh"

  # compose.yml references every app's env_file, so a single missing file breaks
  # the whole stack, not just that app.
  local app name
  for app in "${ALL_APPS[@]}"; do
    name="$(env_file_for "${app}")"
    [ -f "${DEPLOY_DIR}/env/${name}" ] \
      || die "missing deploy/env/${name} — run deploy/scripts/bootstrap.sh"
  done
}

# --------------------------------------------------------------------------
# Compose
# --------------------------------------------------------------------------

compose() {
  docker compose \
    --project-directory "${DEPLOY_DIR}" \
    -f "${COMPOSE_FILE}" \
    --env-file "${ENV_FILE}" \
    --env-file "${IMAGES_FILE}" \
    "$@"
}

compose_build() {
  docker compose \
    --project-directory "${DEPLOY_DIR}" \
    -f "${COMPOSE_FILE}" \
    -f "${COMPOSE_BUILD_FILE}" \
    --env-file "${ENV_FILE}" \
    --env-file "${IMAGES_FILE}" \
    "$@"
}

# --------------------------------------------------------------------------
# Image tag bookkeeping
# --------------------------------------------------------------------------

read_var() { # read_var <file> <name>
  local value
  value="$(grep -E "^$2=" "$1" 2>/dev/null | tail -n1 || true)"
  printf '%s' "${value#*=}"
}

write_var() { # write_var <file> <name> <value>
  local file="$1" name="$2" value="$3" tmp
  tmp="$(mktemp "${file}.XXXXXX")"
  if grep -qE "^${name}=" "${file}"; then
    sed "s|^${name}=.*|${name}=${value}|" "${file}" >"${tmp}"
  else
    { cat "${file}"; printf '%s=%s\n' "${name}" "${value}"; } >"${tmp}"
  fi
  # Preserve the original mode; mktemp creates 0600, which would hide the file
  # from other operators in the docker group.
  chmod --reference="${file}" "${tmp}" 2>/dev/null || chmod 0600 "${tmp}"
  mv "${tmp}" "${file}"
}

current_tag() { read_var "${IMAGES_FILE}" "$(tag_var_for "$1")"; }

snapshot_tags() {
  cp "${IMAGES_FILE}" "${IMAGES_PREVIOUS_FILE}"
  log "previous image tags saved to $(basename "${IMAGES_PREVIOUS_FILE}")"
}

restore_tags() {
  [ -f "${IMAGES_PREVIOUS_FILE}" ] || die "no ${IMAGES_PREVIOUS_FILE} to restore from"
  cp "${IMAGES_PREVIOUS_FILE}" "${IMAGES_FILE}"
}

registry() { read_var "${ENV_FILE}" 'REGISTRY'; }

# --------------------------------------------------------------------------
# Health gate
# --------------------------------------------------------------------------

container_health() { # container_health <service> -> healthy|unhealthy|starting|none|missing
  local cid
  cid="$(compose ps -q "$1" 2>/dev/null | head -n1)"
  if [ -z "${cid}" ]; then printf 'missing'; return 0; fi

  local state health
  state="$(docker inspect -f '{{.State.Status}}' "${cid}" 2>/dev/null || echo unknown)"
  health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${cid}" 2>/dev/null || echo none)"

  if [ "${health}" = 'none' ]; then
    # No healthcheck declared: "running" is the strongest signal available.
    if [ "${state}" = 'running' ]; then printf 'healthy'; else printf 'unhealthy'; fi
  else
    printf '%s' "${health}"
  fi
}

wait_healthy() { # wait_healthy <timeout-seconds> <service>...
  local timeout="$1"; shift
  local -a pending=("$@")
  local -a still=()
  local deadline svc status
  deadline=$(( $(date +%s) + timeout ))

  info "waiting up to ${timeout}s for: ${pending[*]}"

  while [ "${#pending[@]}" -gt 0 ]; do
    still=()
    for svc in "${pending[@]}"; do
      status="$(container_health "${svc}")"
      case "${status}" in
        healthy)
          ok "${svc} healthy"
          ;;
        unhealthy)
          err "${svc} reported unhealthy"
          compose logs --no-color --tail=40 "${svc}" >&2 || true
          return 1
          ;;
        *)
          still+=("${svc}")
          ;;
      esac
    done
    pending=("${still[@]}")

    if [ "${#pending[@]}" -eq 0 ]; then break; fi

    if [ "$(date +%s)" -ge "${deadline}" ]; then
      err "timed out waiting for: ${pending[*]}"
      for svc in "${pending[@]}"; do
        err "--- last 40 log lines: ${svc}"
        compose logs --no-color --tail=40 "${svc}" >&2 || true
      done
      return 1
    fi
    sleep 4
  done

  return 0
}

# --------------------------------------------------------------------------
# Audit trail
# --------------------------------------------------------------------------

history_append() { # history_append <result> <app> <tag> <actor> <ref> <run-url>
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$(_stamp)" "$1" "$2" "$3" "${4:-unknown}" "${5:-}${6:+ ${6}}" \
    >>"${HISTORY_FILE}"
}

# --------------------------------------------------------------------------
# Mutual exclusion — two overlapping rollouts corrupt .env.images
# --------------------------------------------------------------------------

acquire_lock() {
  if command -v flock >/dev/null 2>&1; then
    exec 9>"${LOCK_FILE}"
    flock -n 9 || die 'another deploy is in progress (deploy/.deploy.lock)'
  else
    warn 'flock unavailable; skipping deploy lock'
  fi
}

# --------------------------------------------------------------------------
# Registry auth. CI forwards a short lived GITHUB_TOKEN; nothing long lived is
# ever stored on the host.
# --------------------------------------------------------------------------

REGISTRY_LOGGED_IN=0

registry_login() {
  if [ -n "${GHCR_TOKEN:-}" ] && [ -n "${GHCR_USER:-}" ]; then
    printf '%s' "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USER}" --password-stdin >/dev/null
    log "logged in to ghcr.io as ${GHCR_USER}"
    REGISTRY_LOGGED_IN=1
  fi
}

registry_logout() {
  if [ "${REGISTRY_LOGGED_IN}" = '1' ]; then
    docker logout ghcr.io >/dev/null 2>&1 || true
  fi
}
