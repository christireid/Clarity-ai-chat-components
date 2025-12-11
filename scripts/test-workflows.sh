#!/usr/bin/env bash
#
# Workflow Integration Test Script
# =================================
# This script validates GitHub Actions workflows locally using actionlint and act.
#
# Prerequisites:
# - actionlint: brew install actionlint (macOS) or go install github.com/rhysd/actionlint/cmd/actionlint@latest
# - act (optional): brew install act (macOS) or https://github.com/nektos/act
# - Docker (required for act)
#
# Usage:
#   ./scripts/test-workflows.sh           # Run all validations
#   ./scripts/test-workflows.sh --lint    # Only run actionlint
#   ./scripts/test-workflows.sh --dry-run # Dry-run workflows with act
#   ./scripts/test-workflows.sh --ci      # Dry-run ci.yml specifically
#
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKFLOWS_DIR="$REPO_ROOT/.github/workflows"

# Counters
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Functions
print_header() {
    echo -e "\n${BLUE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASS_COUNT++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAIL_COUNT++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARN_COUNT++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Validate workflow YAML syntax
validate_yaml_syntax() {
    print_header "YAML Syntax Validation"

    for workflow in "$WORKFLOWS_DIR"/*.yml; do
        filename=$(basename "$workflow")
        if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
            print_success "$filename - Valid YAML"
        else
            print_error "$filename - Invalid YAML syntax"
        fi
    done
}

# Run actionlint validation
run_actionlint() {
    print_header "Actionlint Validation"

    if ! command_exists actionlint; then
        print_warning "actionlint not installed. Install with: brew install actionlint"
        echo "  Skipping actionlint validation..."
        return 0
    fi

    # Run actionlint on all workflows
    if actionlint "$WORKFLOWS_DIR"/*.yml; then
        print_success "All workflows pass actionlint validation"
    else
        print_error "Some workflows have actionlint errors"
        return 1
    fi
}

# Check for common security issues
check_security() {
    print_header "Security Checks"

    local issues_found=0

    for workflow in "$WORKFLOWS_DIR"/*.yml; do
        filename=$(basename "$workflow")

        # Check for SHA-pinned actions (should NOT find @v1, @v2, etc. patterns)
        if grep -E 'uses:\s+[^@]+@v[0-9]+(\.[0-9]+)*\s*$' "$workflow" > /dev/null 2>&1; then
            print_error "$filename - Contains non-SHA-pinned actions"
            issues_found=1
        fi

        # Check for permissions block
        if ! grep -q "^permissions:" "$workflow"; then
            print_warning "$filename - Missing explicit permissions block"
        fi

        # Check for timeout-minutes
        if grep -q "runs-on:" "$workflow" && ! grep -q "timeout-minutes:" "$workflow"; then
            print_warning "$filename - Missing timeout-minutes on some jobs"
        fi

        # Check for concurrency
        if ! grep -q "^concurrency:" "$workflow"; then
            print_warning "$filename - Missing concurrency group"
        fi
    done

    if [ $issues_found -eq 0 ]; then
        print_success "All security checks passed"
    fi
}

# Check for best practices
check_best_practices() {
    print_header "Best Practices Checks"

    for workflow in "$WORKFLOWS_DIR"/*.yml; do
        filename=$(basename "$workflow")

        # Skip reusable workflows (they start with _)
        if [[ "$filename" == _* ]]; then
            continue
        fi

        # Check for name field
        if ! grep -q "^name:" "$workflow"; then
            print_warning "$filename - Missing workflow name"
        fi
    done

    print_success "Best practices check completed"
}

# Dry-run with act
run_act_dryrun() {
    local workflow="${1:-ci.yml}"

    print_header "Act Dry-Run: $workflow"

    if ! command_exists act; then
        print_warning "act not installed. Install with: brew install act"
        echo "  Skipping act dry-run..."
        return 0
    fi

    if ! command_exists docker; then
        print_warning "Docker not running. act requires Docker."
        echo "  Skipping act dry-run..."
        return 0
    fi

    local workflow_path="$WORKFLOWS_DIR/$workflow"

    if [ ! -f "$workflow_path" ]; then
        print_error "Workflow file not found: $workflow_path"
        return 1
    fi

    print_info "Running dry-run for $workflow..."

    # Run act in dry-run mode
    if act push -W "$workflow_path" --dryrun -q 2>/dev/null; then
        print_success "$workflow - Dry-run passed"
    else
        print_warning "$workflow - Dry-run had warnings (may be expected for some actions)"
    fi
}

# Generate summary report
generate_summary() {
    print_header "Summary Report"

    echo "Results:"
    echo -e "  ${GREEN}Passed: $PASS_COUNT${NC}"
    echo -e "  ${RED}Failed: $FAIL_COUNT${NC}"
    echo -e "  ${YELLOW}Warnings: $WARN_COUNT${NC}"
    echo ""

    if [ $FAIL_COUNT -gt 0 ]; then
        echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
        return 1
    elif [ $WARN_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⚠️  All checks passed with warnings.${NC}"
        return 0
    else
        echo -e "${GREEN}✅ All checks passed!${NC}"
        return 0
    fi
}

# Main execution
main() {
    cd "$REPO_ROOT"

    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           GitHub Actions Workflow Test Suite                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    local mode="${1:-all}"

    case "$mode" in
        --lint)
            run_actionlint
            ;;
        --dry-run)
            run_act_dryrun "${2:-ci.yml}"
            ;;
        --ci)
            run_act_dryrun "ci.yml"
            ;;
        --security)
            check_security
            ;;
        --help|-h)
            echo "Usage: $0 [option]"
            echo ""
            echo "Options:"
            echo "  --lint      Only run actionlint validation"
            echo "  --dry-run   Dry-run workflows with act (optional: specify workflow)"
            echo "  --ci        Dry-run ci.yml specifically"
            echo "  --security  Run security checks only"
            echo "  --help      Show this help message"
            echo "  (none)      Run all validations"
            exit 0
            ;;
        *)
            validate_yaml_syntax
            run_actionlint
            check_security
            check_best_practices
            ;;
    esac

    generate_summary
}

# Run main
main "$@"
