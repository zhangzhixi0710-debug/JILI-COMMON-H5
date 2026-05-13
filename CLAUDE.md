# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve        # dev server on :8080, /api proxied to https://uat-history.mt7pp.com
npm run build:dev    # build with mode=development
npm run build:test   # build with mode=test
npm run build:prod   # build with mode=production (default `npm run build` is production)
npm run lint         # vue-cli-service lint (eslint + prettier); lintOnSave is OFF
npm run format       # prettier-write src/**/*.{js,vue,css,scss,less}
```

Node 16+. There is no test runner configured.

## Big Picture

This is **NOT** a microfrontend / single-spa app despite the global instructions. It is a single Vue 2.7 + Vue Router + Vuex SPA whose sole purpose is to render **game history records** for ~100+ JILI casino game variants. The "common H5" name refers to the fact that one shell hosts many game-specific history viewers.

### Routing and entry flow

There is exactly one functional route. `src/router/index.js`:

```
/                       → redirects to /:prefix/ingame
/:prefix/ingame         → DynamicLayout (the only screen)
```

`:prefix` is interpreted as a **language code** (e.g. `en-US`, `zh-CN`) by `src/permission.js` — not a tenant or app prefix. The router guard also accepts `?lang=` and persists `?token=` to `localStorage`.

`DynamicLayout.vue` only decides PC vs mobile (by `innerWidth` vs `innerHeight`) and embeds `pages/index/index.vue`. It is not a layout in the classic sense — it owns no routing.

### `pages/index/index.vue` is the real shell

It contains the game list + tabbar + marquee, and **dynamically swaps in a game-specific component** when the user picks a game from `List`:

```
List → @click(item) → handleListClick
  → looks up LayoutConfig[item.No] in src/constants/layout.js
  → if found:  this.component = LayoutConfig[No].component   // dynamic import of pages/<gameId>/index.vue
  → if missing: falls back to pages/index/Details/index.vue  // generic history viewer
```

`LayoutConfig` is a plain id→component map keyed by the numeric game `No`. Adding support for a new game requires:

1. Creating `src/pages/<gameId>/index.vue` (and usually `Details/`, `DetailsSingle/`, `components/`).
2. Registering its numeric `No` → component import in `src/constants/layout.js`.
3. If the game decodes binary results, adding the matching `src/calculate/<gameId>.js` and the protobuf type in `src/pb/proto.js`.

Games whose history is plain enough to render with the default detail view do not need an entry in `LayoutConfig` — they fall through to `pages/index/Details/`.

### Per-game module shape

Each `src/pages/<gameId>/` is self-contained:

- `index.vue` — internal router/state machine that toggles between `Details` and `DetailsSingle` views, forwarding `update:back` up to the shell.
- `Details/` — list of rounds for that game.
- `DetailsSingle/` — drill-down view of one round (decoded board, win lines, etc.).
- `components/` — game-local presentational pieces (e.g. `ImageSign.vue`).

Pair this with `src/calculate/<gameId>.js`, which holds the **pure decoding/payline logic** (symbol IDs, win lines, multipliers, image-path builders). Some games also rely on `src/pb/proto.js` (a generated `protobufjs` bundle) to decode binary `LogPlateInfo` payloads from the API.

`card_config.go` and `gtTranMap.js` inside `src/calculate/` are reference data, not Go code to compile — `card_config.go` is read as text for lookup tables.

### Data layer

- All HTTP goes through `src/api/game.js` → `src/utils/request.js` (axios instance). **Do not call axios directly from components.**
- The interceptor injects `Token` (capital T) from `localStorage`, sets `withCredentials: true`, and unwraps responses where `res.Code === 0` is success; non-zero shows a Vant `Toast.fail` and rejects.
- Default timeout is 5000ms — bear in mind for image-heavy or remote endpoints.
- Endpoints follow `/api/<gameId>/...`; the dev server proxies `/api` to UAT.

### State, i18n, responsive

- Vuex auto-loads everything in `src/store/modules/*.js` via `require.context`. Today only `base.js` exists (`token`, `direction`, `isDesktop`). Modules are namespaced.
- i18n locales live in `src/i18n/locales/*` (`en-US`, `zh-CN`, `zh-TW`, `vi-VN`). The lang code is **also stored under a short alias** (`en|cn|tw|🇻🇳`) in `localStorage.lang` — see `overLocal`/`resultLocal` maps in `src/i18n/index.js`. Always go through `setLanguage()` / `getLanguageValue()`; do not write `localStorage.lang` directly.
- Responsiveness uses a custom rem system in `src/utils/rem.js` (`1rem = clientWidth / 10`). `postcss-pxtorem` is intentionally commented out in `postcss.config.js` — rem conversion happens in JS via `remMixin.js` (`this.rem(px)`, `this.remPC(px)`, `this.remAuto(px)`), not in CSS.

### Build & aliases

`vue.config.js` defines path aliases used everywhere — prefer them over relative paths:

```
@           → src
@mock       → src/mock
@components → src/components
@pages      → src/pages
@assets     → src/assets
@utils      → src/utils
```

SCSS variables in `src/assets/styles/variables.scss` are auto-injected into every SCSS block (`additionalData` in `vue.config.js`).

`babel.config.js` enables on-demand imports via `babel-plugin-import` (Vant) and `babel-plugin-component` (Element-UI) — register Vant/Element components individually (see `main.js`); avoid full-library imports.

Production splits chunks by vendor/common, gzip-compresses, and strips comments via Terser. `console.log` stripping is currently **disabled** (commented out in `vue.config.js`) — leave debug logs out of committed code.

## Conventions worth knowing before changing things

- **Game variants are intentionally duplicated, not abstracted.** `pages/<gameId>/` and `calculate/<gameId>.js` deliberately repeat structure. When adding a new game, copy the closest existing variant rather than building shared abstractions across games — game rules diverge in subtle ways and a shared base tends to leak.
- **Component-Options API is the existing style.** Despite the global "Composition API only" guidance, every `.vue` file in this repo uses the Options API. Match the surrounding file when editing; only introduce Composition API for genuinely new modules where the team has agreed.
- **Game `No` is numeric, game `Id` is a lowercased string.** `handleListClick` lowercases `item.Id` for the `gameId` prop and uses `item.No` for layout lookup. Do not conflate them.
- **Protobuf types are checked-in generated code.** Edit the `.proto` source (not in this repo) and regenerate `src/pb/proto.js`; do not hand-edit it.
