#!/usr/bin/env bash
# One-shot script: convert active images to WebP (max 1800px wide, quality 82)
# Run from repo root: bash scripts/optimise-images.sh

set -e

ASSETS="assets"
QUALITY=82
MAX_WIDTH=1800

IMAGES=(
  "atta-family-jawdi-anmeh-grandson-poster.jpg"
  "atta-jabba-home-exterior.jpg"
  "atta-family-objects-displayed.jpg"
  "wafa-daughters.jpg"
  "atta-ploughing.png"
  "atta-soldier-digger.png"
  "atta-son-olive-tree.jpg"
  "najwa-jaber-grandchildren-home-site.jpg"
  "atta-jeff-field.png"
  "demolished-house-baqaa.jpg"
  "hebron.png"
  "kayed-family-2.png"
)

CREDITS=(
  "credits/Atta.png"
  "credits/jeff-halper.jpg"
  "credits/bruno-sorrentino.jpg"
  "credits/uri-fruchtmann.jpg"
)

convert_to_webp() {
  local src="$ASSETS/$1"
  local base="${1%.*}"
  local dest="$ASSETS/${base}.webp"

  echo "Converting $src → $dest"
  npx --yes @squoosh/cli \
    --webp "{'quality':$QUALITY}" \
    --resize "{\"enabled\":true,\"width\":$MAX_WIDTH,\"height\":0,\"method\":\"lanczos3\",\"fitMethod\":\"stretch\",\"premultiply\":true,\"linearRGB\":true}" \
    -d "$(dirname "$dest")" \
    "$src"

  # squoosh outputs with original extension replaced; rename if needed
  local squoosh_out="$(dirname "$dest")/$(basename "${src%.*}").webp"
  if [ "$squoosh_out" != "$dest" ] && [ -f "$squoosh_out" ]; then
    mv "$squoosh_out" "$dest"
  fi
}

for img in "${IMAGES[@]}"; do
  convert_to_webp "$img"
done

for img in "${CREDITS[@]}"; do
  convert_to_webp "$img"
done

echo ""
echo "Done. Sizes:"
du -sh "$ASSETS"/*.webp "$ASSETS"/credits/*.webp 2>/dev/null
