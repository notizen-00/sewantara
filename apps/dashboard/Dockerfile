# syntax=docker/dockerfile:1
#
# apps/dashboard — Nuxt SPA (ssr:false) for tenant operators.
# Built by .github/workflows/reusable-docker.yml (component: dashboard).
#
# IMPORTANT: this app is client-only, so NUXT_PUBLIC_API_BASE is compiled into
# the JavaScript bundle here, at BUILD time. The resulting image is therefore
# environment specific — changing the API base needs a rebuild, not a restart.
# See docs/adr/0004-dashboard-build-time-config.md.

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS dependencies

WORKDIR /app

ENV NUXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund


FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NUXT_PUBLIC_API_BASE=http://localhost
ARG NUXT_PUBLIC_TENANT_BASE_DOMAIN=sewantara.id
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_TENANT_BASE_DOMAIN=$NUXT_PUBLIC_TENANT_BASE_DOMAIN

RUN npm run build


FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3005

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3005/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", ".output/server/index.mjs"]
