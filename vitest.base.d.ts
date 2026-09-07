import type { ViteUserConfig } from 'vitest/config'

/**
 * The coverage floor a Turystack frontend is held to.
 */
export declare const FLOOR: number

/**
 * Options a frontend may override.
 *
 * Everything but `plugins` belongs to Vitest's `test` block, which is where
 * these land. `plugins` is hoisted to the Vite config, because that is the only
 * place Vite reads it from.
 */
export type WebTestOverrides = NonNullable<ViteUserConfig['test']> & {
	plugins?: ViteUserConfig['plugins']
}

/**
 * The default test configuration for a Turystack web application.
 */
export declare function web(overrides?: WebTestOverrides): ViteUserConfig

/**
 * The mobile configuration — the same one, under the name the mobile apps use.
 */
export declare const mobile: typeof web
