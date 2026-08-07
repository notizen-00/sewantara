# Sewantara monorepo — task entry point.
#
# Targets are grouped: DEV runs on a workstation, OPS runs on the server.
# On Windows use Git Bash / WSL, or call the underlying npm and compose
# commands directly (every target prints what it runs).

SHELL := /bin/bash
# Without -e, .ONESHELL would make only the LAST line of a recipe decide
# success, so a failing test or build in the middle would pass silently.
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
.ONESHELL:

DEPLOY      := deploy
SCRIPTS     := $(DEPLOY)/scripts
COMPOSE     := docker compose --project-directory $(DEPLOY) -f $(DEPLOY)/compose.yml --env-file $(DEPLOY)/.env --env-file $(DEPLOY)/.env.images
COMPOSE_DEV := $(COMPOSE) -f $(DEPLOY)/compose.build.yml

APPS := api dashboard tenant-web landing

# Overridable on the command line: make deploy APP=api TAG=1.4.0
APP ?=
TAG ?=
SVC ?=
CMD ?=

.PHONY: help
help: ## Show this help
	@printf '\nSewantara monorepo\n\n'
	@{ grep -hE '^[a-zA-Z0-9_%-]+:.*?## ' $(MAKEFILE_LIST) || true; } \
		| awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
	@printf '\nVariables: APP=<app> TAG=<image-tag> SVC=<compose-service> CMD="<command>"\n\n'

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

.PHONY: bootstrap
bootstrap: ## Create deploy/.env, .env.images and deploy/env/*.env from templates
	$(SCRIPTS)/bootstrap.sh

.PHONY: install
install: ## Install dependencies for every app
	cd apps/api && composer install && npm ci
	for app in dashboard tenant-web landing; do (cd apps/$$app && npm ci); done

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------

.PHONY: dev-api dev-dashboard dev-tenant-web dev-landing
dev-api: ## Run the Laravel dev stack (serve + queue + vite)
	cd apps/api && composer run dev

dev-dashboard: ## Nuxt dev server for apps/dashboard
	cd apps/dashboard && npm run dev

dev-tenant-web: ## Nuxt dev server for apps/tenant-web
	cd apps/tenant-web && npm run dev

dev-landing: ## Nuxt dev server for apps/landing
	cd apps/landing && npm run dev

.PHONY: check
check: ## Run the same checks CI runs, for every app
	cd apps/api && vendor/bin/pint --test && php artisan test
	for app in dashboard tenant-web landing; do \
		(cd apps/$$app \
			&& npm run lint --if-present \
			&& npm run typecheck --if-present \
			&& npm run test --if-present \
			&& npm run build) || exit 1; \
	done

.PHONY: check-app
check-app: ## Run checks for one app (APP=tenant-web)
	@test -n "$(APP)" || { echo 'APP is required, e.g. make check-app APP=tenant-web'; exit 1; }
	@if [ "$(APP)" = 'api' ]; then \
		cd apps/api && vendor/bin/pint --test && php artisan test; \
	else \
		cd apps/$(APP) \
			&& npm run lint --if-present \
			&& npm run typecheck --if-present \
			&& npm run test --if-present \
			&& npm run build; \
	fi

# ---------------------------------------------------------------------------
# Local full stack (builds from source — never use these on the server)
# ---------------------------------------------------------------------------

.PHONY: up-local
up-local: ## Build every image locally and start the whole stack
	$(COMPOSE_DEV) up -d --build

.PHONY: build-local
build-local: ## Build images locally without starting anything (APP= optional)
	@if [ -n "$(APP)" ]; then \
		$(COMPOSE_DEV) build $(APP); \
	else \
		$(COMPOSE_DEV) build; \
	fi

.PHONY: down
down: ## Stop the stack, keep volumes
	$(COMPOSE) down --remove-orphans

.PHONY: nuke
nuke: ## Stop the stack AND delete volumes (destroys local data)
	@printf 'This deletes postgres_data, redis_data and api_storage. Type YES to continue: '
	@read -r answer && [ "$$answer" = 'YES' ] || { echo 'aborted'; exit 1; }
	$(COMPOSE) down --remove-orphans --volumes

# ---------------------------------------------------------------------------
# Operations (server)
# ---------------------------------------------------------------------------

.PHONY: deploy
deploy: ## Roll out an image tag (make deploy APP=api TAG=1.4.0)
	@test -n "$(APP)" || { echo 'APP is required'; exit 1; }
	@test -n "$(TAG)" || { echo 'TAG is required'; exit 1; }
	$(SCRIPTS)/deploy.sh --tag $(TAG) $(APP)

.PHONY: deploy-all
deploy-all: ## Roll out one tag to every app (make deploy-all TAG=1.4.0)
	@test -n "$(TAG)" || { echo 'TAG is required'; exit 1; }
	$(SCRIPTS)/deploy.sh --tag $(TAG) $(APPS)

.PHONY: restart
restart: ## Recreate an app with its current tag, e.g. after an env change
	@test -n "$(APP)" || { echo 'APP is required'; exit 1; }
	$(SCRIPTS)/deploy.sh --restart-only $(APP)

.PHONY: rollback
rollback: ## Roll an app back to its previous tag (make rollback APP=api)
	@test -n "$(APP)" || { echo 'APP is required'; exit 1; }
	$(SCRIPTS)/rollback.sh $(APP)

.PHONY: status
status: ## Show deployed tags, health and the last rollouts
	$(SCRIPTS)/status.sh --history 10

.PHONY: logs
logs: ## Tail logs (make logs SVC=api-queue), all services when SVC is empty
	$(COMPOSE) logs -f --tail=200 $(SVC)

.PHONY: ps
ps: ## List containers
	$(COMPOSE) ps

.PHONY: migrate
migrate: ## Run central + tenant migrations and the engine seeder
	$(COMPOSE) run --rm --no-deps api-migrate

.PHONY: artisan
artisan: ## Run an artisan command (make artisan CMD="tenants:list")
	@test -n "$(CMD)" || { echo 'CMD is required, e.g. make artisan CMD="tenants:list"'; exit 1; }
	$(COMPOSE) exec -T api php artisan $(CMD)

.PHONY: shell
shell: ## Open a shell in a container (make shell SVC=api)
	$(COMPOSE) exec $(or $(SVC),api) sh

.PHONY: backup
backup: ## Dump PostgreSQL and archive the uploads volume
	$(SCRIPTS)/backup.sh

# ---------------------------------------------------------------------------
# Repo maintenance
# ---------------------------------------------------------------------------

.PHONY: validate
validate: ## Lint the deploy scripts and validate the compose file
	shellcheck $(SCRIPTS)/*.sh
	$(COMPOSE) config >/dev/null && echo 'compose config OK'

.PHONY: tag
tag: ## Create and push a release tag (make tag APP=api TAG=1.4.0)
	@test -n "$(APP)" || { echo 'APP is required'; exit 1; }
	@test -n "$(TAG)" || { echo 'TAG is required (semver, without the v)'; exit 1; }
	git tag -a $(APP)-v$(TAG) -m 'release $(APP) v$(TAG)'
	git push origin $(APP)-v$(TAG)
	@echo 'Release workflow will build, then wait for approval on the production environment.'
