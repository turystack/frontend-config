import { defineConfig } from 'vitest/config'

/**
 * The default test configuration for a Turystack frontend.
 *
 * Same two decisions as the backend, for the same reasons: a suite that passes
 * with no tests is a gate that cannot fail, and the floor is a number rather
 * than an intention.
 */
export const FLOOR = 85

export function web({ plugins, ...overrides } = {}) {
	return defineConfig({
		// Plugins are a Vite concern, not a test one. They used to be spread into
		// `test` along with everything else, where Vitest silently ignored them —
		// so the React plugin was absent from every generated app's test run and
		// the first `.tsx` test failed on syntax it should have understood.
		plugins,
		test: {
			coverage: {
				exclude: [
					'**/~sdk/**',
					'**/routeTree.gen.ts',
					'**/*.types.ts',
					'**/main.tsx',
					'**/*.config.ts',
				],
				provider: 'v8',
				reporter: ['text', 'json-summary', 'json'],
				thresholds: {
					branches: FLOOR,
					functions: FLOOR,
					lines: FLOOR,
					statements: FLOOR,
				},
			},
			environment: 'jsdom',
			passWithNoTests: false,
			...overrides,
		},
	})
}

export const mobile = web
