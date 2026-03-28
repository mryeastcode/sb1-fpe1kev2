#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(pwd)"
BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable not set. Please export a token with repo permissions as GITHUB_TOKEN."
  exit 1
fi

cd "$REPO_DIR"

git config user.name "OpenClaw Bot"
git config user.email "openclaw-bot@example.com"

# Stage all changes
if ! git diff --quiet; then
  git add -A
  COMMIT_MSG="Auto-push: $(date -u +%Y-%m-%dT%H:%M:%SZ) from OpenClaw"
  git commit -m "$COMMIT_MSG" || true
else
  echo "No changes to commit. Skipping push."
  exit 0
fi

REMOTE_URL="https://$GITHUB_TOKEN@github.com/mryeastcode/sb1-fpe1kev2.git"

git push "$REMOTE_URL" "$BRANCH" || {
  echo "Push failed. You may need to check branch protection or token permissions."
  exit 1
}
