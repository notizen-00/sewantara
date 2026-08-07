#!/usr/bin/env bash
#
# What is actually running here, right now.
#
#   deploy/scripts/status.sh              summary table + container states
#   deploy/scripts/status.sh --history 20 also show the last 20 rollouts
#
# Reads the running containers rather than the config files, so it tells you the
# truth even if someone edited .env.images without deploying.

# shellcheck source=./lib.sh
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

HISTORY_LINES=0
case "${1:-}" in
  --history) HISTORY_LINES="${2:-10}" ;;
  '') ;;
  -h | --help)
    sed -n '2,9p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *) die "unknown option '$1'" ;;
esac

require_stack

printf '\n%sDeployed versions%s\n\n' "${C_BLUE}" "${C_RESET}"
printf '%-12s %-24s %-10s %s\n' 'APP' 'TAG (.env.images)' 'HEALTH' 'RUNNING IMAGE'
printf '%-12s %-24s %-10s %s\n' '---' '-----------------' '------' '-------------'

for app in "${ALL_APPS[@]}"; do
  tag="$(current_tag "${app}")"
  primary="$(primary_service_for "${app}")"
  health="$(container_health "${primary}")"
  cid="$(compose ps -q "${primary}" 2>/dev/null | head -n1)"

  image='-'
  revision=''
  if [ -n "${cid}" ]; then
    image="$(docker inspect -f '{{.Image}}' "${cid}" 2>/dev/null | cut -c1-19)"
    revision="$(docker inspect \
      -f '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${cid}" 2>/dev/null || true)"
  fi

  case "${health}" in
    healthy) colour="${C_GREEN}" ;;
    missing) colour="${C_DIM}" ;;
    *) colour="${C_RED}" ;;
  esac

  printf '%-12s %-24s %s%-10s%s %s\n' \
    "${app}" "${tag:-unset}" "${colour}" "${health}" "${C_RESET}" "${image}"

  if [ -n "${revision}" ] && [ "${revision}" != '<no value>' ]; then
    printf '%s             commit %s%s\n' "${C_DIM}" "${revision}" "${C_RESET}"
  fi
done

printf '\n%sContainers%s\n\n' "${C_BLUE}" "${C_RESET}"
compose ps

printf '\n%sHost%s\n\n' "${C_BLUE}" "${C_RESET}"
printf 'checkout   %s\n' \
  "$(git -C "${REPO_ROOT}" describe --tags --always --dirty 2>/dev/null || echo 'not a git checkout')"
printf 'registry   %s\n' "$(registry)"
printf 'disk       %s\n' "$(df -h "${REPO_ROOT}" | awk 'NR==2 {print $4" free of "$2}')"
printf 'docker     %s\n' \
  "$(docker system df --format '{{.Type}}={{.Size}}' 2>/dev/null | tr '\n' ' ')"

if [ "${HISTORY_LINES}" -gt 0 ] && [ -s "${HISTORY_FILE}" ]; then
  printf '\n%sLast %s rollouts%s\n\n' "${C_BLUE}" "${HISTORY_LINES}" "${C_RESET}"
  printf '%-21s %-12s %-12s %-24s %s\n' 'WHEN (UTC)' 'RESULT' 'APP' 'TAG' 'BY'
  tail -n "${HISTORY_LINES}" "${HISTORY_FILE}" \
    | awk -F'\t' '{printf "%-21s %-12s %-12s %-24s %s\n", $1, $2, $3, $4, $5}'
fi

echo
