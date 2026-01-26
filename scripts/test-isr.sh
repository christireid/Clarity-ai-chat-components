#!/bin/bash

# ISR Cache Testing Script
# Wave 3.3 Agent 35 - ISR Cache Optimizer
#
# Tests Incremental Static Regeneration functionality:
# 1. First request (cache MISS) - measures baseline TTFB
# 2. Second request (cache HIT) - measures cached TTFB
# 3. Verifies cache headers are set correctly
# 4. Calculates improvement percentage

set -e

TARGET_URL="${1:-http://localhost:3000}"
TEST_PATH="${2:-/api/reference/hooks}"

echo ""
echo "🧪 ISR Cache Performance Test"
echo "================================"
echo "Target: $TARGET_URL$TEST_PATH"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to extract TTFB from curl timing
get_ttfb() {
  local url=$1
  local time_starttransfer=$(curl -o /dev/null -s -w '%{time_starttransfer}' "$url")
  # Convert to milliseconds and return
  echo "$(echo "$time_starttransfer * 1000" | bc)"
}

# Function to get cache headers
get_cache_headers() {
  local url=$1
  curl -I -s "$url" | grep -i "cache-control\|age\|x-vercel-cache\|cf-cache-status" || echo "No cache headers found"
}

echo "📊 Test 1: First Request (Cache MISS)"
echo "--------------------------------------"
TTFB_MISS=$(get_ttfb "$TARGET_URL$TEST_PATH")
CACHE_HEADERS_MISS=$(get_cache_headers "$TARGET_URL$TEST_PATH")

echo "TTFB: ${TTFB_MISS}ms"
echo "Cache Headers:"
echo "$CACHE_HEADERS_MISS"
echo ""

# Wait a bit to ensure cache is populated
echo "⏳ Waiting 2 seconds for cache to populate..."
sleep 2
echo ""

echo "📊 Test 2: Second Request (Cache HIT)"
echo "--------------------------------------"
TTFB_HIT=$(get_ttfb "$TARGET_URL$TEST_PATH")
CACHE_HEADERS_HIT=$(get_cache_headers "$TARGET_URL$TEST_PATH")

echo "TTFB: ${TTFB_HIT}ms"
echo "Cache Headers:"
echo "$CACHE_HEADERS_HIT"
echo ""

# Calculate improvement
IMPROVEMENT=$(echo "scale=1; (($TTFB_MISS - $TTFB_HIT) / $TTFB_MISS) * 100" | bc)

echo "📈 Results Summary"
echo "================================"
echo "First request (MISS):  ${TTFB_MISS}ms"
echo "Second request (HIT):  ${TTFB_HIT}ms"
echo "Improvement:           ${IMPROVEMENT}%"
echo ""

# Validate results
SUCCESS=true

# Check if cached request is faster
if (( $(echo "$TTFB_HIT < $TTFB_MISS" | bc -l) )); then
  echo -e "${GREEN}✅ Cache HIT is faster than MISS${NC}"
else
  echo -e "${RED}❌ Cache HIT is not faster (possible issue)${NC}"
  SUCCESS=false
fi

# Check if cached TTFB is under 100ms (target)
if (( $(echo "$TTFB_HIT < 100" | bc -l) )); then
  echo -e "${GREEN}✅ Cached TTFB < 100ms target${NC}"
elif (( $(echo "$TTFB_HIT < 200" | bc -l) )); then
  echo -e "${YELLOW}⚠️  Cached TTFB is ${TTFB_HIT}ms (target: <100ms)${NC}"
else
  echo -e "${RED}❌ Cached TTFB is ${TTFB_HIT}ms (target: <100ms)${NC}"
  SUCCESS=false
fi

# Check improvement percentage (should be > 70%)
if (( $(echo "$IMPROVEMENT > 70" | bc -l) )); then
  echo -e "${GREEN}✅ Cache provides ${IMPROVEMENT}% improvement${NC}"
elif (( $(echo "$IMPROVEMENT > 50" | bc -l) )); then
  echo -e "${YELLOW}⚠️  Cache provides ${IMPROVEMENT}% improvement (target: >70%)${NC}"
else
  echo -e "${RED}❌ Cache improvement is only ${IMPROVEMENT}% (target: >70%)${NC}"
  SUCCESS=false
fi

# Check for cache-control headers
if echo "$CACHE_HEADERS_HIT" | grep -qi "cache-control"; then
  echo -e "${GREEN}✅ Cache-Control headers present${NC}"
else
  echo -e "${RED}❌ Cache-Control headers missing${NC}"
  SUCCESS=false
fi

# Check for stale-while-revalidate
if echo "$CACHE_HEADERS_HIT" | grep -qi "stale-while-revalidate"; then
  echo -e "${GREEN}✅ stale-while-revalidate configured${NC}"
else
  echo -e "${YELLOW}⚠️  stale-while-revalidate not found${NC}"
fi

echo ""

if [ "$SUCCESS" = true ]; then
  echo -e "${GREEN}🎉 All ISR tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some ISR tests failed${NC}"
  exit 1
fi
