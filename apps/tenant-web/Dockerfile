# syntax=docker/dockerfile:1
#
# apps/tenant-web — Nuxt SSR, serves every tenant subdomain.
# Built by .github/workflows/reusable-docker.yml (component: tenant-web).
#
# All configuration is read at runtime from env, so one image serves every
# environment. See deploy/env/tenant-web.env.example.

# Major-pinned on purpose: a rebuild must pick up Node security patches.
# package.json requires >=22.19.0, which any current 22.x satisfies.
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS dependencies
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# nuxt.config.ts sets typescript.typeCheck, so this also type checks the app.
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

# node's own fetch: no wget/curl needed, so the image stays minimal.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", ".output/server/index.mjs"]
