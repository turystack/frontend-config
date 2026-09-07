#!/usr/bin/env node

/**
 * The gate that keeps this package and `@turystack/config` telling one story.
 *
 * Biome 2 does not follow a nested `extends`: a configuration reached through
 * `extends` may declare one of its own and Biome ignores it, silently, with no
 * diagnostic and no exit code. That was measured, not assumed — a base reached
 * one level deep applies, two levels deep it does not, whether the link is a
 * relative path or a package specifier.
 *
 * So this package cannot extend the baseline; it restates it. Restating is
 * duplication, and duplication drifts, so the parts that must stay identical
 * are listed here and compared. A formatter option changed in one file and not
 * the other fails this, rather than showing up as a diff in someone's editor
 * three weeks later.
 */

import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const require = createRequire(import.meta.url)
const ROOT = resolve(import.meta.dirname, '..')

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const base = read(require.resolve('@turystack/config/biome'))
const own = read(resolve(ROOT, 'biome.json'))

/** Blocks this package must copy from the baseline verbatim. */
const IDENTICAL = ['$schema', 'vcs', 'formatter', 'json']

/** Leaves that must agree, given as paths so a sibling may differ freely. */
const LEAVES = [
	['linter', 'enabled'],
	['linter', 'rules', 'recommended'],
	['linter', 'rules', 'style', 'useBlockStatements'],
	['files', 'ignoreUnknown'],
	['javascript', 'formatter', 'quoteStyle'],
	['javascript', 'formatter', 'semicolons'],
	['javascript', 'formatter', 'arrowParentheses'],
	['javascript', 'formatter', 'bracketSpacing'],
	['javascript', 'formatter', 'trailingCommas'],
	['javascript', 'formatter', 'expand'],
	['assist', 'actions', 'source', 'useSortedKeys'],
	['assist', 'actions', 'source', 'useSortedProperties'],
]

const at = (value, path) =>
	path.reduce((current, key) => (current == null ? current : current[key]), value)

const problems = []

for (const key of IDENTICAL) {
	if (JSON.stringify(base[key]) !== JSON.stringify(own[key])) {
		problems.push(`${key}: differs from @turystack/config`)
	}
}

for (const path of LEAVES) {
	const label = path.join('.')

	if (JSON.stringify(at(base, path)) !== JSON.stringify(at(own, path))) {
		problems.push(`${label}: differs from @turystack/config`)
	}
}

// Every file the baseline looks at, this package looks at too. It may look at
// more — a backend has scripts and a drizzle config, a frontend has an
// index.html — but never at less.
for (const pattern of base.files.includes) {
	if (!own.files.includes.includes(pattern)) {
		problems.push(`files.includes: "${pattern}" is in the baseline and not here`)
	}
}

// The baseline's overrides, which `extends` would have concatenated if Biome
// followed one. They are restated here, so they are compared here.
const overrideKey = (override) => JSON.stringify(override.includes)
const ownOverrides = new Map(own.overrides.map((o) => [overrideKey(o), o]))

for (const override of base.overrides) {
	const mine = ownOverrides.get(overrideKey(override))

	if (!mine) {
		problems.push(`overrides: the baseline has one for ${overrideKey(override)} and this package does not`)
		continue
	}

	if (JSON.stringify(mine) !== JSON.stringify(override)) {
		problems.push(`overrides ${overrideKey(override)}: differs from @turystack/config`)
	}
}

if (problems.length > 0) {
	process.stdout.write(`\n✖ ${problems.length} difference(s) from @turystack/config:\n`)
	for (const problem of problems) {
		process.stdout.write(`  ${problem}\n`)
	}
	process.stdout.write('\n')
	process.exitCode = 1
} else {
	process.stdout.write(
		`\n✓ every block shared with @turystack/config is identical here\n\n`,
	)
}
