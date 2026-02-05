#!/bin/bash

# Glassmorphism Fix Script for /chat page
# This script fixes all glassmorphism inconsistencies identified in the audit

FILE="app/chat/page.tsx"

echo "🔍 Starting glassmorphism fixes for $FILE..."

# Backup original file
cp "$FILE" "$FILE.backup"
echo "✅ Created backup: $FILE.backup"

# Fix 1: Remove border-0 from glass-card (4 instances)
echo "🔧 Fix 1: Removing border-0 from glass-card..."
sed -i '' 's/glass-card border-0/glass-card/g' "$FILE"

# Fix 2: Add dark mode to border classes
echo "🔧 Fix 2: Adding dark mode to borders..."
sed -i '' 's/border-b border-white\/10 glass-subtle/glass-subtle border-b border-white\/20 dark:border-white\/10/g' "$FILE"
sed -i '' 's/border-b border-white\/10 glass-panel/glass-panel border-b border-white\/20 dark:border-white\/10/g' "$FILE"
sed -i '' 's/border-t">/border-t border-white\/20 dark:border-white\/10">/g' "$FILE"
sed -i '' 's/border border-white\/10"/border border-white\/20 dark:border-white\/10"/g' "$FILE"

# Fix 3: Replace hard-coded gradients with gradient-accent
echo "🔧 Fix 3: Replacing hard-coded gradients..."
sed -i '' "s/'bg-gradient-to-br from-violet-500 to-purple-600 text-white'/'gradient-accent text-white glow-sm'/g" "$FILE"
sed -i '' 's/"bg-gradient-to-br from-violet-500 to-purple-600 text-white"/"gradient-accent text-white glow-sm"/g' "$FILE"

# Fix 4: Replace bg-muted with glass-subtle where appropriate
echo "🔧 Fix 4: Replacing bg-muted with glass variants..."
sed -i '' 's/"bg-muted rounded-2xl px-4 py-3"/"glass-subtle rounded-2xl px-4 py-3"/g' "$FILE"
sed -i '' 's/bg-muted rounded-full/glass-subtle rounded-full/g' "$FILE"

# Fix 5: Add glass-card to Card components without it
echo "🔧 Fix 5: Adding glass-card to Card components..."
# This is tricky with sed, so we'll do specific ones
sed -i '' 's/<Card>$/<Card className="glass-card">/g' "$FILE"
sed -i '' 's/<Card className="">/<Card className="glass-card">/g' "$FILE"

# Fix 6: Add hover effects to buttons
echo "🔧 Fix 6: Adding hover effects..."
sed -i '' 's/className="h-10 w-10 shrink-0">/className="h-10 w-10 shrink-0 hover:glass-subtle transition-all">/g' "$FILE"
sed -i '' 's/className="w-full justify-start gap-2">/className="w-full justify-start gap-2 hover:glow-sm transition-all">/g' "$FILE"

# Fix 7: Replace hard-coded status backgrounds with glass-panel
echo "🔧 Fix 7: Replacing hard-coded status backgrounds..."
sed -i '' 's/bg-blue-500\/10 border border-blue-500\/20/glass-panel border-l-2 border-l-blue-500/g' "$FILE"
sed -i '' 's/bg-yellow-500\/10 border border-yellow-500\/20/glass-panel border-l-2 border-l-yellow-500/g' "$FILE"
sed -i '' 's/bg-green-500\/10 border border-green-500\/20/glass-panel border-l-2 border-l-green-500/g' "$FILE"
sed -i '' 's/bg-green-500\/10"/glass-panel border-l-2 border-l-green-500"/g' "$FILE"
sed -i '' 's/bg-red-500\/10 border border-red-500\/30/glass-panel border-l-2 border-l-red-500/g' "$FILE"
sed -i '' 's/bg-yellow-500\/10 border border-yellow-500\/30/glass-panel border-l-2 border-l-yellow-500/g' "$FILE"

# Fix 8: Add transition-colors to card-hover elements
echo "🔧 Fix 8: Adding transitions..."
sed -i '' 's/hover:glass-subtle"/hover:glass-subtle transition-colors"/g' "$FILE"
sed -i '' 's/hover:glass-subtle cursor-pointer"/hover:glass-subtle cursor-pointer transition-colors"/g' "$FILE"

# Fix 9: Fix icon containers
echo "🔧 Fix 9: Fixing icon containers..."
sed -i '' 's/w-8 h-8 rounded-lg bg-primary\/10/w-8 h-8 rounded-lg icon-container-sm/g' "$FILE"

# Fix 10: Add glow to primary buttons
echo "🔧 Fix 10: Adding glow to primary buttons..."
sed -i '' 's/className="gap-2">$/className="gap-2 glow-sm transition-all">/g' "$FILE"

# Fix 11: Terminal background - replace hard-coded dark bg
echo "🔧 Fix 11: Fixing terminal background..."
sed -i '' 's/bg-\[#1e1e1e\]/glass-strong dark:bg-black\/40/g' "$FILE"

echo "✅ All fixes applied!"
echo ""
echo "📊 Summary of changes:"
grep -c "glass-card" "$FILE" && echo "   glass-card classes found"
grep -c "dark:border-white" "$FILE" && echo "   dark mode borders added"
grep -c "gradient-accent" "$FILE" && echo "   gradient-accent classes found"
grep -c "glow-sm" "$FILE" && echo "   glow-sm effects added"
grep -c "transition-all" "$FILE" && echo "   transition-all added"
echo ""
echo "💡 Review the changes and test in both light and dark mode"
echo "💡 Backup saved as: $FILE.backup"
