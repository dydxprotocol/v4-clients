#!/usr/bin/env bash
set -euo pipefail

VERSION=$(jq -r '.version' package.json)
NAME=$(jq -r '.name' package.json)
TAG="v${VERSION}"

echo "Checking npm registry for ${NAME}@${VERSION}..."

set +e
VIEW_OUTPUT=$(npm view "${NAME}@${VERSION}" 2>&1)
VIEW_EXIT=$?
set -e

if [ $VIEW_EXIT -eq 0 ]; then
  echo "Skipping publish: ${NAME}@${VERSION} already exists"
  exit 0
fi

if ! echo "$VIEW_OUTPUT" | grep -qiE 'E404|not found|No matching version'; then
  echo "Registry check failed unexpectedly:"
  echo "$VIEW_OUTPUT"
  exit 1
fi

echo "Version not found. Proceeding with release."

git fetch --tags --quiet
git config user.email "ci@dydx.exchange"
git config user.name "github_actions"

if git show-ref --tags --verify --quiet "refs/tags/$TAG"; then
  echo "Tag $TAG already exists"
else
  git tag -a "$TAG" -m "Release $TAG"
  git push origin "$TAG"
fi

unset NODE_AUTH_TOKEN
npm publish --provenance --access public
