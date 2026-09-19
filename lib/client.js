// dsh-skin-miku — browser half (client plugin bundle).
//
// Loaded by dsh-client-modules at /plugins/dsh-skin-miku/client.js and
// executed through the vendored cordis Loader's lazy-CJS module table
// (window.__ModuleLoader__.load). The factory body is plain CJS with
// require() resolved against the shell's module table — the same shape the
// shipped ui-* packages' tsdown bundles emit.
//
// Every require() must hit the shell's frozen PLATFORM_MODULES seed table
// (react, react/jsx-runtime, react-dom, react-dom/client,
// @deepseek-ai/cordis, @deepseek-ai/dsh-client-store,
// @deepseek-ai/dsh-client-ui-slots, @deepseek-ai/dsh-client-ui-primitives,
// @deepseek-ai/dsh-client-ui-dockkit). Stores come from the seed's
// @deepseek-ai/dsh-client-store (defineStore/createSnapshotStore), NOT from
// the retired @deepseek-ai/dsh-client-runtime package.
//
// The plugin registers one third-party theme ("skin-miku") into DSH's
// built-in ThemeRuntime: a dark colorScheme plus a --dsw-alias-* /
// --dsw-specific-* / --shiki-* token override set applied as inline custom
// properties on <body> by ui-layout's ThemePresenter. The palette is a
// faithful port of xenolithe's "Miku" VS Code theme (editor.background
// #131313, editor.foreground #56d0bd, contrastBorder #56d0bd, tab
// backgrounds #212121 / #1a1a1a, plus its tokenColors mapped onto DSH's
// shiki css-variable palette).
//
// A single toggle card is registered into Settings → General (between
// dsh-skin's skin and wallpaper rows). The choice persists in localStorage
// and is re-asserted after boot, because DSH only persists system/light/dark
// itself.
window.__ModuleLoader__.load({
	id: "dsh-skin-miku",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _react = require("react");
		let _store = require("@deepseek-ai/dsh-client-store");

		//#region dsh-skin-miku: definitions
		/** The settings row's locale namespace. */
		const SETTINGS_NS = "settings.skin-miku";
		/** localStorage key holding the toggle ("1" = on). */
		const STORAGE_KEY = "dsh-skin-miku:enabled";

		/**
		 * The Miku skin. Values are concrete CSS colors (no var() indirection),
		 * ported from xenolithe's Miku theme:
		 *   - surfaces: editor/titleBar/sideBar/statusBar #131313, active tab
		 *     #212121, section header #1a1a1a;
		 *   - teal #56d0bd carries the foreground, brand, borders and focus
		 *     (contrastBorder);
		 *   - applied comment & punctuation are lightened for readability
		 *     (#529a90 / #b18cea); upstream tokenColors were:
		 *   - tokenColors: keyword #47F560, string #56D159, function #FFF402,
		 *     operator/punctuation #905BDE, variable #01F5DE, constant #5684D1,
		 *     tag #196AFF, attribute #19BFFF, link #82AAFF, comment #546E7A,
		 *     invalid/error #FF5370.
		 */
		const SKIN = {
			id: "skin-miku",
			labelKey: "miku",
			colorScheme: "dark",
			tokens: {
				// Surfaces — editor chrome on #131313, raised on #1a1a1a / #212121.
				"--dsw-alias-bg-base": "#131313",
				"--dsw-alias-bg-layer-1": "#1a1a1a",
				"--dsw-alias-bg-layer-2": "#212121",
				"--dsw-alias-bg-layer-3": "#272727",
				"--dsw-alias-bg-overlay": "#212121",
				"--dsw-alias-bg-module-platform": "#1a1a1a",
				"--dsw-alias-bg-multi-select": "#212121",
				"--dsw-alias-bg-skeleton": "rgba(86, 208, 189, 0.12)",
				"--dsw-alias-bg-mask-1": "rgba(0, 0, 0, 0.5)",
				"--dsw-alias-bg-mask-2": "rgba(0, 0, 0, 0.2)",
				"--dsw-alias-bg-mask-3": "rgba(0, 0, 0, 0.6)",
				"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
				"--dsw-alias-bg-mask-drop": "rgba(19, 19, 19, 0.7)",

				// Borders — teal contrastBorder, stepped by strength.
				"--dsw-alias-border-l1": "rgba(86, 208, 189, 0.16)",
				"--dsw-alias-border-l2": "rgba(86, 208, 189, 0.32)",
				"--dsw-alias-border-l2-darkmode-thin": "rgba(86, 208, 189, 0.2)",
				"--dsw-alias-border-l3": "rgba(86, 208, 189, 0.5)",
				"--dsw-alias-border-l4": "rgba(86, 208, 189, 0.7)",
				"--dsw-alias-border-inverted": "rgba(86, 208, 189, 0.1)",
				"--dsw-alias-border-inverted2": "rgba(86, 208, 189, 0.18)",

				// Brand = Miku teal.
				"--dsw-alias-brand-primary": "#56d0bd",
				"--dsw-alias-brand-primary-invert": "#131313",
				"--dsw-alias-brand-primary-new-colorprimary-new-color": "#56d0bd",
				"--dsw-alias-brand-text": "#56d0bd",

				// Buttons.
				"--dsw-alias-button-primary-fill": "#56d0bd",
				"--dsw-alias-button-primary-hover": "#7ae0cf",
				"--dsw-alias-button-primary-dimmed": "rgba(86, 208, 189, 0.14)",
				"--dsw-alias-button-contrast-fill": "#56d0bd",
				"--dsw-alias-button-elevated-fill": "#212121",
				"--dsw-alias-button-floating-fill": "#1a1a1a",
				"--dsw-alias-button-floating-hover": "#212121",
				"--dsw-alias-button-ghost-active-fill": "rgba(86, 208, 189, 0.14)",
				"--dsw-alias-button-ghost-active-hover": "rgba(86, 208, 189, 0.22)",
				"--dsw-alias-button-ghost-active-border": "#56d0bd",
				"--dsw-alias-button-info-fill": "#196aff",
				"--dsw-alias-button-info-hover": "#3b85ff",
				"--dsw-alias-button-tool-bar-fill": "rgba(86, 208, 189, 0.22)",
				"--dsw-alias-button-tool-bar-hover": "rgba(86, 208, 189, 0.34)",
				"--dsw-alias-button-tool-bar-fill-invisible": "rgba(86, 208, 189, 0.1)",

				// Text — editor.foreground #56d0bd as the primary label.
				"--dsw-alias-label-primary": "#56d0bd",
				"--dsw-alias-label-secondary": "#b2ccd6",
				"--dsw-alias-label-tertiary": "#7d9aa6",
				"--dsw-alias-label-caption": "#529a90",
				"--dsw-alias-label-dimmed": "#529a90",
				"--dsw-alias-label-primary-bluish": "#56d0bd",
				"--dsw-alias-label-primary-dimmed": "#b2ccd6",
				"--dsw-alias-label-primary-foreground": "#131313",
				"--dsw-alias-label-primary-inverted": "#131313",

				// Interactive states — teal washes.
				"--dsw-alias-interactive-bg-hover": "rgba(86, 208, 189, 0.1)",
				"--dsw-alias-interactive-bg-hover-accent": "rgba(86, 208, 189, 0.18)",
				"--dsw-alias-interactive-bg-active": "rgba(86, 208, 189, 0.24)",
				"--dsw-alias-interactive-bg-hover-solid": "#212121",
				"--dsw-alias-interactive-bg-hover-danger": "rgba(255, 83, 112, 0.14)",

				// States — invalid/error, keyword green, function yellow.
				"--dsw-alias-state-error-primary": "#ff5370",
				"--dsw-alias-state-error-secondary": "#f07178",
				"--dsw-alias-state-success-primary": "#47f560",
				"--dsw-alias-state-success-secondary": "#56d159",
				"--dsw-alias-state-success-tertiary": "rgba(71, 245, 96, 0.12)",
				"--dsw-alias-state-warn-primary": "#fff402",
				"--dsw-alias-state-warn-secondary": "#fbff00",
				"--dsw-alias-state-warn-tertiary": "rgba(255, 244, 2, 0.1)",
				"--dsw-alias-state-warn-label": "#fff402",
				"--dsw-alias-state-business-primary": "#56d0bd",
				"--dsw-alias-state-business-tertiary": "rgba(86, 208, 189, 0.12)",

				// Markdown / code surfaces — slightly deeper than the canvas.
				"--dsw-alias-markdown-code-block": "#0f0f0f",
				"--dsw-alias-markdown-code-block-banner": "#1a1a1a",
				"--dsw-alias-markdown-inline-code": "#212121",
				"--dsw-alias-markdown-citation": "#1a1a1a",
				"--dsw-alias-markdown-code-segment-selected": "#1a1a1a",
				"--dsw-alias-markdown-code-segment-unselected": "#131313",
				"--dsw-alias-markdown-tag": "#1a1a1a",
				"--dsw-alias-markdown-placeholder": "#212121",

				// Scrollbars — teal tracks.
				"--dsw-alias-scrollbar-bg-l1": "rgba(86, 208, 189, 0.25)",
				"--dsw-alias-scrollbar-bg-l2": "rgba(86, 208, 189, 0.3)",
				"--dsw-alias-scrollbar-hover-l1": "rgba(86, 208, 189, 0.45)",
				"--dsw-alias-scrollbar-hover-l2": "rgba(86, 208, 189, 0.5)",

				// Toast / tooltip.
				"--dsw-alias-toast-bg": "#212121",
				"--dsw-alias-tooltip-bg": "#272727",

				// Specific surfaces — sidebar follows the VSCode chrome: same
				// #131313 base, section headers #1a1a1a, active item #212121
				// with a teal accent.
				"--dsw-specific-sidebar-fill": "#131313",
				"--dsw-specific-sidebar-nav-item-hover": "#1a1a1a",
				"--dsw-specific-sidebar-nav-item-active": "#212121",
				"--dsw-specific-sidebar-nav-item-active-accent": "#56d0bd",
				"--dsw-specific-menu": "#212121",
				"--dsw-specific-selector": "#1a1a1a",
				"--dsw-specific-input-major": "#1a1a1a",
				"--dsw-specific-login-input": "#131313",
				"--dsw-specific-bubble": "#1a1a1a",
				"--dsw-specific-bubble-highlight": "#212121",
				"--dsw-specific-tip": "#1a1a1a",

				// A faint teal wash for the "thinking" gradient.
				"--dsw-linear-gradient-think": "linear-gradient(180deg, rgba(86, 208, 189, 0.16) 20.19%, rgba(86, 208, 189, 0) 100%)",

				// Static accent scale — components that read the static scale
				// directly get the Miku accents instead of the default blue.
				"--dsw-static-deepseek-50": "#eefaf8",
				"--dsw-static-deepseek-100": "#d9f5f0",
				"--dsw-static-deepseek-200": "#b3ebe2",
				"--dsw-static-deepseek-300": "#8ce0d4",
				"--dsw-static-deepseek-400": "#6dd6c6",
				"--dsw-static-deepseek-450": "#56d0bd",
				"--dsw-static-deepseek-500": "#56d0bd",
				"--dsw-static-deepseek-600": "#44a99a",
				"--dsw-static-deepseek-800": "#2a5f57",
				"--dsw-static-deepseek-900": "#1c3f3a",
				"--dsw-static-blue-400": "#3b85ff",
				"--dsw-static-blue-450": "#2a78ff",
				"--dsw-static-blue-500": "#196aff",
				"--dsw-static-blue-600": "#1559d6",
				"--dsw-static-red-400": "#f07178",
				"--dsw-static-red-500": "#ff5370",
				"--dsw-static-red-600": "#e6445e",
				"--dsw-static-green-400": "#56d159",
				"--dsw-static-green-500": "#47f560",
				"--dsw-static-amber-400": "#fbff00",
				"--dsw-static-amber-500": "#fff402",
				"--dsw-static-amber-600": "#e6dc00",

				// Syntax highlighting (shiki css-variables) — Miku tokenColors.
				"--shiki-token-constant": "#5684d1",
				"--shiki-token-string": "#56d159",
				"--shiki-token-comment": "#529a90",
				"--shiki-token-keyword": "#47f560",
				"--shiki-token-parameter": "#01f5de",
				"--shiki-token-function": "#fff402",
				"--shiki-token-string-expression": "#c3e88d",
				"--shiki-token-punctuation": "#b18cea",
				"--shiki-token-link": "#82aaff"
			}
		};

		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"miku.title": "Miku 皮肤",
			"miku.label": "初音 Miku",
			"miku.hint": "高对比青绿配色，取自 xenolithe 的 Miku VS Code 主题。再次点击关闭并回到默认外观。"
		};

		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"miku.title": "Miku skin",
			"miku.label": "Hatsune Miku",
			"miku.hint": "High-contrast teal palette based on xenolithe's Miku VS Code theme. Click again to turn it off and return to the default appearance."
		};
		//#endregion

		//#region dsh-skin-miku: persistence
		/** Read a localStorage string value (null on absence or error). */
		function readStorage(key) {
			try {
				const value = window.localStorage.getItem(key);
				return typeof value === "string" ? value : null;
			} catch {
				return null;
			}
		}

		/** Write (or remove with null) a localStorage value. */
		function writeStorage(key, value) {
			try {
				if (value === null) window.localStorage.removeItem(key);
				else window.localStorage.setItem(key, value);
				return true;
			} catch {
				return false;
			}
		}
		//#endregion

		//#region dsh-skin-miku: settings row store
		/**
		 * Miku row slot store: a mirror of the theme service snapshot. The
		 * plugin's apply-world change listener is the only writer; the row
		 * component reads via props.useStore.
		 */
		function createSkinStore() {
			return (0, _store.defineStore)({
				init: () => ({
					active: false,
					revision: -1
				}),
				actions: {
					sync: (d, active, revision) => {
						if (revision <= d.revision) return;
						d.active = active;
						d.revision = revision;
					}
				}
			});
		}
		//#endregion

		//#region dsh-skin-miku: settings row
		/** Inline style sheet for the row (kept dependency-free). */
		const styles = {
			group: {
				borderBottom: "1px solid var(--dsw-alias-border-l2)",
				display: "flex",
				flexDirection: "column",
				gap: "8px",
				padding: "16px 0"
			},
			title: {
				color: "var(--dsw-alias-label-primary)",
				fontSize: "14px",
				fontWeight: 400,
				lineHeight: "22px"
			},
			hint: {
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: "12px",
				lineHeight: "18px"
			},
			grid: {
				display: "flex",
				flexWrap: "wrap",
				gap: "10px"
			},
			card: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "6px",
				width: "96px",
				padding: "3px",
				borderRadius: "10px",
				border: "2px solid transparent",
				background: "transparent",
				cursor: "pointer",
				font: "inherit",
				boxSizing: "border-box"
			},
			cardSelected: {
				borderColor: "var(--dsw-alias-brand-primary)",
				background: "var(--dsw-alias-interactive-bg-hover)"
			},
			cardLabel: {
				color: "var(--dsw-alias-label-secondary)",
				fontSize: "12px",
				lineHeight: "16px",
				whiteSpace: "nowrap"
			},
			cardLabelSelected: {
				color: "var(--dsw-alias-label-primary)"
			},
			swatch: {
				width: "100%",
				height: "52px",
				borderRadius: "8px",
				boxSizing: "border-box",
				padding: "8px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				gap: "6px",
				background: "#131313",
				border: "1px solid rgba(86, 208, 189, 0.32)"
			},
			swatchLine: {
				height: "7px",
				borderRadius: "4px"
			}
		};

		/** Mini palette preview: canvas, teal brand, white selection. */
		function Swatch() {
			return _react.createElement(
				"div",
				{ style: styles.swatch },
				_react.createElement("div", {
					style: { ...styles.swatchLine, width: "70%", background: "#56d0bd" }
				}),
				_react.createElement("div", {
					style: { ...styles.swatchLine, width: "45%", background: "#ffffff", opacity: 0.9 }
				}),
				_react.createElement("div", {
					style: { ...styles.swatchLine, width: "55%", background: "#529a90", opacity: 0.85 }
				})
			);
		}

		/**
		 * Miku toggle row registered into the Settings → General item slot,
		 * between dsh-skin's skin row (order 20) and wallpaper row (order 30):
		 * title + one toggle card.
		 */
		function MikuRow({ t, setSkin, useStore }) {
			const active = useStore((s) => s.active);
			return _react.createElement(
				"div",
				{ style: styles.group },
				_react.createElement("div", { style: styles.title }, t("miku.title")),
				_react.createElement(
					"div",
					{ style: styles.grid },
					_react.createElement(
						"button",
						{
							type: "button",
							"aria-pressed": active,
							onClick: () => setSkin(!active),
							style: { ...styles.card, ...(active ? styles.cardSelected : {}) }
						},
						_react.createElement(Swatch, {}),
						_react.createElement(
							"span",
							{ style: { ...styles.cardLabel, ...(active ? styles.cardLabelSelected : {}) } },
							t("miku.label")
						)
					)
				),
				_react.createElement("div", { style: styles.hint }, t("miku.hint"))
			);
		}
		//#endregion

		//#region dsh-skin-miku: client plugin body
		/**
		 * Required services: theme runtime (skin registration + switching),
		 * slots/locale (the settings row). Persistence is localStorage, so no
		 * settings transport is needed.
		 */
		const inject = [
			"slots",
			"locale",
			"theme"
		];

		/**
		 * Client plugin body: register the Miku skin into the theme runtime,
		 * restore the saved toggle (re-asserted after boot, once the Host
		 * settings scope has adopted its durable preference), keep the row's
		 * store in sync with theme/change, and register the toggle row into
		 * Settings → General.
		 * @param ctx - client cordis context.
		 */
		function apply(ctx) {
			let dispose = () => {};
			try {
				dispose = ctx.theme.register(SKIN);
			} catch (error) {
				console.warn("[dsh-skin-miku] theme registration:", error);
			}
			ctx.effect(() => () => {
				dispose();
			}, "dsh-skin-miku: theme registration");

			// Restore the saved toggle. Host settings may adopt system/light/dark
			// after we register (and dsh-skin may re-assert its own saved skin),
			// so re-assert on the next ticks only when this plugin's toggle is on.
			const reassert = () => {
				if (readStorage(STORAGE_KEY) !== "1") return;
				const current = ctx.theme.getTheme().preference;
				if (current === SKIN.id) return;
				try {
					ctx.theme.setTheme(SKIN.id);
				} catch (error) {
					console.warn("[dsh-skin-miku] reassert:", error);
				}
			};
			reassert();
			const reassertTimers = [setTimeout(reassert, 0), setTimeout(reassert, 80), setTimeout(reassert, 300)];
			ctx.effect(() => () => {
				for (const timer of reassertTimers) clearTimeout(timer);
			}, "dsh-skin-miku: reassert cleanup");

			const store = createSkinStore();
			let bound;
			const sync = (snapshot) => {
				bound?.sync(snapshot.preference === SKIN.id, snapshot.revision);
			};
			ctx.on("theme/change", sync);

			ctx.effect(() => ctx.locale.register(SETTINGS_NS, {
				zh,
				en
			}), "dsh-skin-miku: settings row dictionaries");

			const injected = (actions) => {
				bound = actions;
				sync(ctx.theme.getTheme());
				return {
					setSkin: (on) => {
						writeStorage(STORAGE_KEY, on ? "1" : null);
						try {
							ctx.theme.setTheme(on ? SKIN.id : "system");
						} catch (error) {
							console.warn("[dsh-skin-miku] setSkin:", error);
						}
					}
				};
			};
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "skin-miku",
				order: 25,
				store,
				locale: SETTINGS_NS,
				inject: injected
			}, MikuRow));
		}
		//#endregion

		exports.SETTINGS_NS = SETTINGS_NS;
		exports.SKIN = SKIN;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
