#!/bin/bash
# Overnight Claude Code runner
# Iterates through prompts/*.txt in numeric order, auto-commits each one,
# pushes a fresh branch at the end. Designed to run unattended.

set -u

PROJECT_DIR="$HOME/Desktop/notary-finder-web"
LOG="$PROJECT_DIR/overnight.log"
BRANCH="overnight-batch-$(date +%Y%m%d-%H%M)"

cd "$PROJECT_DIR" || { echo "Project dir not found: $PROJECT_DIR"; exit 1; }

git checkout main 2>&1 | tee -a "$LOG"
git pull 2>&1 | tee -a "$LOG"
git checkout -b "$BRANCH" 2>&1 | tee -a "$LOG"

echo "=== Overnight run started at $(date) on branch $BRANCH ===" | tee -a "$LOG"

for f in $(ls prompts/*.txt 2>/dev/null | sort); do
  N=$(basename "$f" .txt)
  echo "" | tee -a "$LOG"
  echo "================================================" | tee -a "$LOG"
  echo "=== [$N] starting at $(date '+%H:%M:%S') ===" | tee -a "$LOG"
  echo "================================================" | tee -a "$LOG"

  cat "$f" | claude --dangerously-skip-permissions -p 2>&1 | tee -a "$LOG"

  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "Overnight: $N" 2>&1 | tee -a "$LOG"
  else
    echo "[no changes for $N]" | tee -a "$LOG"
  fi
done

echo "" | tee -a "$LOG"
echo "=== Done at $(date) ===" | tee -a "$LOG"
git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG"
echo "Branch pushed: $BRANCH" | tee -a "$LOG"
