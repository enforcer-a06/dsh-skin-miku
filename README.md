# dsh-skin-miku

Miku skin for DeepSeek Harness — a high-contrast teal-on-black palette based
on [xenolithe's Miku VS Code theme](https://marketplace.visualstudio.com/items?itemName=xenolithe.miku)
([preview](https://vscodethemes.com/e/xenolithe.miku/miku)).

It registers one third-party theme (`skin-miku`) into DSH's built-in theme
runtime and adds a **Miku** toggle card to **Settings → General**, between the
`dsh-skin` skin row and its wallpaper row. The toggle persists across reloads
(localStorage) and is re-asserted after boot.

## How it works

DSH's theme system is token-based: the web shell ships `--dsw-*` design
tokens, and `ThemeRuntime` lets third-party plugins register themes that
override the alias layer (`--dsw-alias-*`), the specific layer
(`--dsw-specific-*`), and the shiki syntax palette (`--shiki-token-*`). This
package is a regular dual-face plugin:

- **Host half** (`lib/index.js`) — a `dsh.bundle` patch layer that inserts one
  loader entry (`skin-miku`); a no-op `apply`, exactly like `dsh-skin` and the
  shipped ui-* packages.
- **Browser half** (`lib/client.js`) — a `dsh.client` bundle (served at
  `/plugins/dsh-skin-miku/client.js`) that:
  1. registers the Miku skin via `ctx.theme.register(...)`;
  2. restores the saved toggle and applies it with `ctx.theme.setTheme(...)`;
  3. keeps the row store in sync with `theme/change`;
  4. mounts the toggle row into `settings.general.item`.

The skin sets `colorScheme: "dark"` (which drives
`body[data-ds-dark-theme]`), and the token map is applied as inline custom
properties on `<body>` by ui-layout's ThemePresenter.

## Palette

| Role | Miku theme | DSH token |
|------|-----------|-----------|
| Canvas / editor background | `#131313` | `--dsw-alias-bg-base` |
| Section header | `#1a1a1a` | `--dsw-alias-bg-layer-1` |
| Active tab / raised surface | `#212121` | `--dsw-alias-bg-layer-2` |
| Foreground / brand / contrast border | `#56d0bd` | `--dsw-alias-label-primary`, `--dsw-alias-brand-primary`, borders |
| Selection | `#ffffff` | swatch accent |
| Comment (italic) | `#546E7A` → **`#529A90`** | `--shiki-token-comment` |
| Keyword / storage | `#47F560` | `--shiki-token-keyword` |
| String | `#56D159` | `--shiki-token-string` |
| Function / class | `#FFF402` | `--shiki-token-function` |
| Operator / punctuation | `#905BDE` → **`#B18CEA`** | `--shiki-token-punctuation` |
| Variable | `#01F5DE` | `--shiki-token-parameter` |
| Constant / number | `#5684D1` | `--shiki-token-constant` |
| Tag | `#196AFF` | button info fill |
| Attribute | `#19BFFF` | — |
| Link | `#82AAFF` | `--shiki-token-link` |
| Invalid / deleted | `#FF5370` | `--dsw-alias-state-error-primary` |

Two applied values deviate from upstream for contrast. Measured on their own
backgrounds (WCAG 2.1), the upstream values sat below the 4.5:1 body-text
floor, which made dim text genuinely hard to read:

| Token | Upstream | Applied | Before → after |
|---|---|---|---|
| `--shiki-token-comment` | `#546E7A` | `#529A90` | 3.55:1 → 5.83:1 |
| `--dsw-alias-label-caption` / `--dsw-alias-label-dimmed` | `#546E7A` | `#529A90` | 3.44:1 → 5.65:1 (5.89:1 on `#212121`) |
| `--shiki-token-punctuation` | `#905BDE` | `#B18CEA` | 4.32:1 → 7.13:1 |

The secondary/tertiary greys are also teal-tinted, keeping each level's
luminance ladder (contrast is preserved within ±0.4, so only the hue changes):

| Token | Upstream | Applied | Before → after |
|---|---|---|---|
| `--dsw-alias-label-secondary` | `#b2ccd6` | `#6dd6c6` | 11.06:1 → 10.69:1 |
| `--dsw-alias-label-primary-dimmed` | `#b2ccd6` | `#6dd6c6` | 11.06:1 → 10.69:1 |
| `--dsw-alias-label-tertiary` | `#7d9aa6` | `#44a99a` | 6.23:1 → 6.54:1 |

`tertiary` is the level DSH paints tool-row descriptions, chevrons, statuses and
file sizes with; `secondary`/`primary-dimmed` carry reasoning-block items and
file names. Teal here means the tool activity reads as the same family as the
assistant's prose instead of as grey chrome.

The user-message bubble is also retinted. DSH paints it with
`--dsw-specific-bubble` and hard-codes its text to `--dsw-alias-label-primary`,
so upstream the user's bubble (`#1a1a1a`) and the assistant's reply (plain
`#131313`) differed by 7% luminance — the two speakers were nearly
indistinguishable. A teal-tinted panel makes the speaker obvious while keeping
the teal text above AAA:

| Token | Upstream | Applied | Bubble vs page base | Teal text on it |
|---|---|---|---|---|
| `--dsw-specific-bubble` | `#1a1a1a` | `#17302b` | ΔE 3.4 → 16.4 | 9.24:1 → 7.46:1 |
| `--dsw-specific-bubble-highlight` | `#212121` | `#1d3a33` | — (unreferenced by components) | 6.54:1 |

Everything else is the upstream Miku palette unchanged — in particular the teal
foreground `#56d0bd` (9.87:1 on `#131313`, above the WCAG AAA 7:1 floor) that
defines the skin's look, plus the teal-tinted borders, scrollbars and hover
washes.

## Install

```bash
# 1. install the package into the web profile — this also appends its true
#    package name to the profile's `dsh.profile.bundles`, because the package
#    declares `dsh.bundle.patch` (no manual package.json edit needed).
dsh plugin --profile web add "file:/absolute/path/to/dsh-skin-miku"

# 2. restart the web profile (new loader entries are picked up at boot)
#    Ctrl-C the running `dsh web`, then run `dsh web` again, and refresh the page.
```

This is a self-contained, build-free package: no npm dependencies to install,
no assets, no compile step. The only host requirement is a DSH whose web shell
still ships the module table listed below.

Then open **Settings → General** and click the **初音 Miku / Hatsune Miku**
card.

## Notes

- The toggle writes `dsh-skin-miku:enabled` to localStorage; DSH itself only
  persists the built-in `system`/`light`/`dark` preference.
- `dsh-skin`'s own picker and this toggle coexist: the last one applied wins
  for the session, and both re-assert their saved choice after reload. Turn
  the Miku card off to hand control back to the default appearance.

## The module table (read this before changing `require()`)

`lib/client.js` is a lazy-CJS bundle: every `require()` is answered **only**
from the shell's frozen `PLATFORM_MODULES` seed table, and anything else throws
`client-modules: require("...") missed the module table` at boot — the GUI then
shows **"Failed to load plugins"** instead of the app, even though
`dsh web` itself starts fine.

The current seed table (DSH `0.1.5-rc.2`) is:

```
react, react/jsx-runtime, react-dom, react-dom/client,
@deepseek-ai/cordis, @deepseek-ai/dsh-client-store,
@deepseek-ai/dsh-client-ui-slots, @deepseek-ai/dsh-client-ui-primitives,
@deepseek-ai/dsh-client-ui-dockkit
```

Stores come from the seed's `@deepseek-ai/dsh-client-store`
(`defineStore`, `createSnapshotStore`); the older
`@deepseek-ai/dsh-client-runtime/client` package no longer exists and must not
be required. Only specifiers in this table may appear in the bundle — verify
with `node smoke-test.mjs`, which extracts the table from the installed
frontend bundle and fails on any other request.

`package.json`'s `dsh.client.inject` list (package names whose client halves
should arrive first) is unrelated to module resolution: it accepts real
plugin packages only. A non-baseline module request would instead go in
`dsh.client.external`, answered by a plugin package row or a seed word.
