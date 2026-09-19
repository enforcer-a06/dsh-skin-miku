/**
 * dsh-skin-miku — host half.
 *
 * The host side is intentionally a no-op loader entry: the whole feature
 * lives in the browser half (`./client`), which DSH's dsh-client-modules
 * picks up through the package's `dsh.client` declaration — the same shape
 * as dsh-skin and the shipped ui-* packages. The skin toggle is persisted
 * in localStorage, matching DSH's boundary for visual preferences that the
 * Host settings wire does not expose.
 */

/** Host loader entry for the browser implementation exported from `./client`. */
export function apply() {}
