.PHONY: help backend frontend docker-up docker-down docker-logs

help:
	@echo "Accounting System - Available Commands"
	@echo "========================================"
	@echo "make backend         - Run Go backend"
	@echo "make frontend        - Run React frontend"
	@echo "make docker-up       - Start PostgreSQL with Docker"
	@echo "make docker-down     - Stop PostgreSQL"
	@echo "make install-backend - Install backend dependencies"
	@echo "make install-frontend - Install frontend dependencies"

backend:
	@echo "Starting Go backend..."
	cd backend && go run main.go

frontend:
	@echo "Starting React frontend..."
	cd frontend && npm run dev

install-backend:
	@echo "Installing backend dependencies..."
	cd backend && go mod download

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

docker-up:
	@echo "Starting PostgreSQL..."
	docker-compose up -d
	@echo "PostgreSQL is running on port 5432"

docker-down:
	@echo "Stopping PostgreSQL..."
	docker-compose down

docker-logs:
	docker-compose logs -f postgres
