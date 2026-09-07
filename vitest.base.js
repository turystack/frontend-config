import { coverage, FLOOR } from '@turystack/config/vitest'
import { defineConfig } from 'vitest/config'

/**
 * The default test configuration for a Turystack frontend.
 *
 * Same two decisions as the backend, for the same reasons: a suite that passes
 * with no tests is a gate that cannot fail, and the floor is a number rather
 * than an intention. The number itself is the backend's too — it comes from
 * `@turystack/config`, which is what stops the two from drifting apart.
 */
export { FLOOR }

export function web({ plugins, ...overrides } = {}) {
	return defineConfig({
		// Plugins are a Vite concern, not a test one. They used to be spread into
		// `test` along with everything else, where Vitest silently ignored them —
		// so the React plugin was absent from every generated app's test run and
		// the first `.tsx` test failed on syntax it should have understood.
		plugins,
		test: {
			coverage: coverage({
				// Composition roots: the router wires routes, the root route wires
				// providers, the query client is configuration. A test for any of
				// them asserts that the wiring is the wiring.
				exclude: [
					'**/*.config.ts',
					'**/*.types.ts',
					'**/~sdk/**',
					'**/main.tsx',
					'**/query-client.ts',
					'**/routeTree.gen.ts',
					'**/router.tsx',
					'**/routes/__root.tsx',
				],
			}),
			environment: 'jsdom',
			passWithNoTests: false,
			...overrides,
		},
	})
}

export const mobile = web
