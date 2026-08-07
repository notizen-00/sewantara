# syntax=docker/dockerfile:1
#
# apps/landing — Nuxt SSR, sewantara.id.
# Built by .github/workflows/reusable-docker.yml (component: landing).

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS dependencies

WORKDIR /app

ENV NUXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund


FROM node:${NODE_VERSION}-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:${NODE_VERSION}-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0
ENV PORT=3003

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3003/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", ".output/server/index.mjs"]
