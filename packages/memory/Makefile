.PHONY: help install build test lint format clean setup dev validate

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

build-watch: ## Build in watch mode
	npm run build:watch

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

test-ci: ## Run tests for CI
	npm run test:ci

lint: ## Run linter
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

lint-ci: ## Run linter for CI
	npm run lint:ci

typecheck: ## Type check
	npm run typecheck

typecheck-watch: ## Type check in watch mode
	npm run typecheck:watch

format: ## Format code
	npm run format

format-check: ## Check code formatting
	npm run format:check

clean: ## Clean build artifacts
	npm run clean

clean-all: ## Clean everything including node_modules
	npm run clean:all

validate: ## Run all checks (typecheck + lint + format + test)
	npm run validate

precommit: ## Run pre-commit checks
	npm run precommit

check: validate ## Alias for validate

all: clean install build test ## Clean, install, build, and test
