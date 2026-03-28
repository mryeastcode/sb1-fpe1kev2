#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(pwd)"
# Get current branch, default to main if unknown
BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")"

# Check if GITHUB_TOKEN is set
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable not set. Please export a token with repo permissions." >&2
  exit 1
fi

cd "$REPO_DIR"

# Configure Git user locally for this commit
git config user.name "OpenClaw Bot"
git config user.email "openclaw-bot@example.com"

# Stage all changes
if ! git diff --quiet; then
  git add -A
  COMMIT_MSG="Auto-push: $(date -u +%Y-%m-%dT%H:%M:%SZ) from OpenClaw"
  git commit -m "$COMMIT_MSG" || {
    echo "Commit failed. Check Git status and staged files." >&2
    exit 1
  }
else
  echo "No changes to commit. Skipping push."
  exit 0
fi

# Construct the remote URL with the token
# Assumes the repo is on GitHub. For other providers, this might need adjustment.
REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/mryeastcode/sb1-fpe1kev2.git"

# Push to the current branch
echo "Pushing to origin/$BRANCH..."
if git push "$REMOTE_URL" "$BRANCH"; then
  echo "Push successful to origin/$BRANCH."
else
  echo "Push failed to origin/$BRANCH. Common issues:" >&2
  echo "1. GITHUB_TOKEN permissions (needs repo scope)." >&2
  echo "2. Remote repository might have branch protection rules." >&2
  echo "3. Network issues or temporary GitHub API problems." >&2
  exit 1
fi
