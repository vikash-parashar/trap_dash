#!/usr/bin/env bash
# Builds the single-file game page from web/ for the browser preview and for the Android app.
set -euo pipefail
cd "$(dirname "$0")"
js(){ echo '<script>'; echo '(()=>{'; cat web/helpers.js web/hero.js web/gfx.js web/noir.js web/chars.js web/game.js web/traps.js web/story.js web/app.js; echo '})();'; echo '</script>'; }
mkdir -p dist app/src/main/assets
{ echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'; cat web/head.html; echo '</head><body>'; cat web/body.html; js; echo '</body></html>'; } > dist/index.html
# App build: offline fonts, app mode on, no Google Fonts request.
{ echo '<!doctype html><html lang="en" class="app"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">'
  echo '<link rel="stylesheet" href="fonts/fonts.css">'
  grep -v 'fonts.googleapis.com' web/head.html
  echo '<style>'; cat web/app.css; echo '</style></head><body>'; cat web/body.html; js; echo '</body></html>'; } > app/src/main/assets/index.html
mkdir -p dist/audio && cp app/src/main/assets/audio/*.mp3 dist/audio/
echo "built dist/index.html and app/src/main/assets/index.html"
