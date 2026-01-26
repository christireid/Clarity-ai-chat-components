#!/bin/bash

# Script to wrap all console statements in development checks
# Processes all TypeScript files in src/

PACKAGE_DIR="/Users/christireid/Dev/Clarity-ai-chat-components/packages/token-optimization/src"

# Find all files with console statements (excluding already processed test files)
files_to_process=(
  "security/redis-security-store.ts"
  "formats/markdown-optimizer.ts"
  "errors/index.ts"
  "security/security-event-streaming.ts"
  "hooks/use-token-budget-monitor.ts"
  "formats/toon-optimizer/core.ts"
  "utils/crypto.ts"
  "security/enhanced-security.ts"
  "observability/index.ts"
  "routing/complexity-analyzer.ts"
  "formats/toon-optimizer/strategies.ts"
  "analytics/cost-calculator.ts"
  "utils/token-estimation.ts"
  "compression/strategies/index.ts"
  "unified-optimizer.ts"
  "tokenizers/provider-native-counter.ts"
  "routing/simple-router.ts"
  "routing/model-router.ts"
  "providers/prompt-caching.ts"
  "models/model-registry.ts"
  "files/file-optimizer.ts"
  "defaults.ts"
  "compression/strategies/llmlingua.ts"
  "compression/strategies/adaptive.ts"
  "compression/basic-engine.ts"
  "caching/advanced-semantic-cache.ts"
  "budget/advanced-budget.ts"
  "__tests__/compression/markdown-compressor.test.ts"
  "security/simple-security.ts"
  "security/input-validator.ts"
  "routing/intelligent-routing.ts"
  "resilience/circuit-breaker.ts"
  "react/components/TokenCostPreview.tsx"
  "models/model-pricing.ts"
  "index.ts"
  "hooks/use-token-optimization.ts"
  "health/index.ts"
  "formats/toon-optimizer/validators.ts"
  "formats/toon-optimizer/index.ts"
  "formats/binary-serialization.ts"
  "factory.ts"
  "compression/strategies/memory-summarize.ts"
  "compression/strategies/memory-extract.ts"
  "compression/strategies/memory-adaptive.ts"
  "compression/strategies/extractive.ts"
  "compression/strategies/binary-compression.ts"
  "compression/markdown-compressor.ts"
  "compression/advanced-engine.ts"
  "components/token-budget-bar.tsx"
  "components/AdvancedTokenCostPreview.tsx"
  "chunking/text-chunker.ts"
  "caching/advanced-cache.ts"
  "accessibility/token-display.tsx"
  "accessibility/announcer.ts"
  "__tests__/production-integration.test.ts"
)

echo "Processing ${#files_to_process[@]} files..."

for file in "${files_to_process[@]}"; do
  filepath="$PACKAGE_DIR/$file"

  if [ ! -f "$filepath" ]; then
    echo "Skipping $file (not found)"
    continue
  fi

  # Count console statements before
  before=$(grep -c "console\.\(log\|error\|warn\|info\|debug\)" "$filepath" 2>/dev/null || echo "0")

  if [ "$before" = "0" ]; then
    echo "Skipping $file (no console statements)"
    continue
  fi

  echo "Processing $file ($before console statements)..."
done

echo "Done! Please use manual editing for complex cases."
