#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

REMOTE="${GIT_REMOTE:-origin}"
BRANCH="${DEPLOY_BRANCH:-gh-pages}"

REMOTE_URL="$(cd "$ROOT" && git remote get-url "$REMOTE")"
if [[ -z "${PUBLIC_PATH+x}" ]] || [[ -z "$PUBLIC_PATH" ]]; then
  if [[ "$REMOTE_URL" =~ github\.com[:/]([^/]+)/([^/.]+)(\.git)?$ ]]; then
    repo="${BASH_REMATCH[2]}"
    if [[ "$repo" =~ \.github\.io$ ]]; then
      PUBLIC_PATH="/"
    else
      PUBLIC_PATH="/$repo/"
    fi
  else
    PUBLIC_PATH="/"
  fi
fi

PUBLIC_PATH="$PUBLIC_PATH" npm run build -- --public-path "$PUBLIC_PATH"

cd dist
cp index.html 404.html
rm -rf .git
git init
git add -A
git commit -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git branch -M "$BRANCH"
git remote add origin "$(cd "$ROOT" && git remote get-url "$REMOTE")"
git push -f origin "$BRANCH"
cd "$ROOT"
rm -rf dist/.git
