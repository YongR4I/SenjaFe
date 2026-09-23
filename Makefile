COMPOSE := docker compose

.PHONY: build up down restart logs ps pull health deploy

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f --tail=200

ps:
	$(COMPOSE) ps

pull:
	$(COMPOSE) pull

health:
	@set -eu; \
	ids="$$($(COMPOSE) ps -q)"; \
	if [ -z "$$ids" ]; then \
		echo "No running compose containers found. Run 'make up' first."; \
		exit 1; \
	fi; \
	timeout_sec=120; \
	start_ts="$$(date +%s)"; \
	echo "Waiting for containers to become healthy (timeout: $${timeout_sec}s)..."; \
	while :; do \
		all_ready=1; \
		has_bad=0; \
		for id in $$ids; do \
			name="$$(docker inspect -f '{{.Name}}' "$$id" | sed 's#^/##')"; \
			status="$$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$$id")"; \
			printf '%s: %s\n' "$$name" "$$status"; \
			case "$$status" in \
				healthy|running) ;; \
				starting|unhealthy) \
					all_ready=0; \
					[ "$$status" = "unhealthy" ] && has_bad=1 ;; \
				exited|dead) \
					echo "Container $$name is not running (status: $$status)."; \
						docker logs --tail=80 "$$id" || true; \
					exit 1 ;; \
				*) all_ready=0 ;; \
			esac; \
		done; \
		if [ "$$all_ready" -eq 1 ]; then \
			echo "All containers are healthy."; \
			break; \
		fi; \
		now_ts="$$(date +%s)"; \
		elapsed="$$((now_ts - start_ts))"; \
		if [ "$$elapsed" -ge "$$timeout_sec" ]; then \
			echo "Timeout after $${timeout_sec}s waiting for healthy status."; \
			$(COMPOSE) ps; \
			for id in $$ids; do \
				name="$$(docker inspect -f '{{.Name}}' "$$id" | sed 's#^/##')"; \
				echo "--- logs: $$name ---"; \
				docker logs --tail=80 "$$id" || true; \
			done; \
			exit 1; \
		fi; \
		if [ "$$has_bad" -eq 1 ]; then \
			echo "Health check still failing, retrying... ($${elapsed}s elapsed)"; \
		else \
			echo "Still waiting... ($${elapsed}s elapsed)"; \
		fi; \
		sleep 2; \
	done

deploy:
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d
	$(MAKE) health
