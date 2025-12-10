#!/bin/bash
# colors.sh - Shared color definitions and output utilities for scripts
#
# Usage:
#   source "$(dirname "$0")/lib/colors.sh"
#
# Then use:
#   print_status 0 "Success message"
#   print_warning "Warning message"
#   print_step "Step description"
#   print_header "Header text"

# =============================================================================
# COLOR DEFINITIONS
# =============================================================================

# Basic colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Bold variants
BOLD_RED='\033[1;31m'
BOLD_GREEN='\033[1;32m'
BOLD_YELLOW='\033[1;33m'
BOLD_BLUE='\033[1;34m'

# Background colors
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'

# =============================================================================
# OUTPUT FUNCTIONS
# =============================================================================

# Print status with checkmark or X based on exit code
# Usage: print_status $? "Description"
print_status() {
    local exit_code=$1
    local message=$2
    if [ "$exit_code" -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $message"
    else
        echo -e "${RED}✗${NC} $message"
        return 1
    fi
}

# Print a warning message
# Usage: print_warning "Warning text"
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Print an error message
# Usage: print_error "Error text"
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Print an info message
# Usage: print_info "Info text"
print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Print a step indicator
# Usage: print_step "Step description"
print_step() {
    echo -e "\n${BLUE}→${NC} $1"
}

# Print a header/title
# Usage: print_header "Title"
print_header() {
    local title=$1
    local width=${2:-40}
    local border=$(printf '=%.0s' $(seq 1 $width))
    echo -e "\n${BLUE}${border}${NC}"
    echo -e "${BLUE}  $title${NC}"
    echo -e "${BLUE}${border}${NC}"
}

# Print a sub-header
# Usage: print_subheader "Subtitle"
print_subheader() {
    echo -e "\n${CYAN}── $1 ──${NC}"
}

# Print success message with celebration
# Usage: print_success "Success message"
print_success() {
    echo -e "${GREEN}✓${NC} ${GREEN}$1${NC}"
}

# Print a separator line
# Usage: print_separator
print_separator() {
    echo -e "${BLUE}────────────────────────────────────────${NC}"
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Check if we're in the project root
# Usage: ensure_project_root
ensure_project_root() {
    if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
        print_error "Must run from project root"
        exit 1
    fi
}

# Create a cleanup trap for temporary directories
# Usage: setup_cleanup_trap "$TEMP_DIR"
setup_cleanup_trap() {
    local temp_dir=$1
    trap "rm -rf $temp_dir" EXIT
}

# Retry a command with exponential backoff
# Usage: retry_with_backoff 4 2 "git push"
retry_with_backoff() {
    local max_retries=$1
    local initial_delay=$2
    shift 2
    local command="$@"

    local attempt=0
    local delay=$initial_delay

    while [ $attempt -lt $max_retries ]; do
        if eval "$command"; then
            return 0
        fi

        attempt=$((attempt + 1))
        if [ $attempt -lt $max_retries ]; then
            print_warning "Attempt $attempt failed, retrying in ${delay}s..."
            sleep $delay
            delay=$((delay * 2))
        fi
    done

    print_error "Command failed after $max_retries attempts"
    return 1
}

# =============================================================================
# EXPORT CHECK
# =============================================================================

# Mark that colors.sh has been sourced
COLORS_SH_LOADED=1
