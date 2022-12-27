build:
	docker compose build
up:
	docker compose up -d
up-local:
	docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
down:
	docker compose down