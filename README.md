# Trap Dash

A cartoon trap platformer by Ampli Studio. Nothing is what it looks like: floors fall, coins bite, and flags run away.

## Where things are

| Path | What it is |
|---|---|
| `web/` | The game (HTML canvas + JavaScript): `helpers.js` art helpers, `hero.js` Dash/Nova/Bolt, `gfx.js` realistic background layers, `game.js` level, traps, lives and ads flow, `app.js` full-screen app mode |
| `build.sh` | Joins `web/` into one page: `dist/index.html` (browser preview) and `app/src/main/assets/index.html` (Android) |
| `app/` | Android app that runs the game full screen, offline, in landscape or portrait |
| `.github/workflows/build-apk.yml` | Every push builds `TrapDash-N.apk` and puts it in Releases (`build-N`) |

## Test build

Every push to `main` or a `claude/**` branch makes a pre-release named **Trap Dash test build N** with the APK attached. Open it in Chrome on the phone and install.

Test APKs are signed with `app/test.keystore` (standard Android debug passwords, test only) so each one installs over the last. The Play Store build will use the upload key kept in GitHub secrets.

## Plan

This first build is the playable demo level. The full game (1000 levels, 29 traps, Play Games leaderboard, AdMob, No Ads / Mega Pack) follows round by round.
