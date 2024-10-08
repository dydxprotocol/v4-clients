#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

base_dir="packages/dydxjs/proto"

for dir in dydxprotocol slinky noble-cctp ; do
  rm -rf "$base_dir/$dir"
  mkdir -p "$base_dir/$dir"
  echo "Autogenerated folder, see export_protos.sh" > "$base_dir/$dir/README.md"

  buf export "$base_dir/$dir-src/proto" --output "$base_dir/$dir"
done
