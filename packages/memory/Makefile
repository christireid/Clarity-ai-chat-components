.PHONY: help install build test lint format clean setup dev

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

setup: ## Quick setup (install + build)
	npm run setup

build: ## Build the package
	npm run build

dev: ## Start development mode (watch)
	npm run dev

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

test-ui: ## Run tests with UI
	npm run test:ui

lint: ## Run linter
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

typecheck: ## Type check
	npm run typecheck

format: ## Format code
	npm run format

format-check: ## Check code formatting
	npm run format:check

clean: ## Clean build artifacts
	npm run clean

check: ## Run all checks (typecheck + lint + format + test)
	npm run typecheck && npm run lint && npm run format:check && npm test

all: clean install build test ## Clean, install, build, and test
