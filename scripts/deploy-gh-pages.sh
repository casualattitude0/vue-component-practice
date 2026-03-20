#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

REMOTE="${GIT_REMOTE:-origin}"
BRANCH="${DEPLOY_BRANCH:-gh-pages}"
PUBLIC_PATH="${PUBLIC_PATH:-/}"

npm run build -- --public-path "$PUBLIC_PATH"

cd dist
rm -rf .git
git init
git add -A
git commit -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git branch -M "$BRANCH"
git remote add origin "$(cd "$ROOT" && git remote get-url "$REMOTE")"
git push -f origin "$BRANCH"
cd "$ROOT"
rm -rf dist/.git
