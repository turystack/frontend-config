#!/usr/bin/env node

/**
 * The fixture gate.
 *
 * A GritQL pattern matches a syntactic shape that is not obvious from reading
 * it — `Date.now()` does not match a literal `Date.now()`, because an empty
 * argument list binds through a metavariable. A rule written from one example
 * catches that example and degrades silently when the code around it changes.
 *
 * So every rule ships a pair, named after it:
 *
 *   fixtures/fail/<rule>.ts   must produce that rule's diagnostic
 *   fixtures/pass/<rule>.ts   must produce none
 *
 * Both sides are derived from the plugins directory, so adding a rule is
 * adding three files and nothing else.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const ROOT = resolve(import.meta.dirname, '..')
const FIXTURES = resolve(ROOT, 'fixtures')
// Biome is spawned with `cwd` set to the fixtures directory, so a relative
// override — which is what CI passes — resolves one level too deep and fails
// as ENOENT even though the binary installed fine. Anchor a path-shaped value
// to the package root; a bare name still goes through PATH.
const configuredBiome = process.env.BIOME ?? 'biome'
const BIOME = configuredBiome.includes('/')
  ? resolve(ROOT, configuredBiome)
  : configuredBiome

const rules = readdirSync(resolve(ROOT, 'plugins'))
  .filter((file) => file.endsWith('.grit'))
  .map((file) => file.replace('.grit', ''))
  .sort()

// The fixture config is generated from the plugins directory rather than
// maintained beside it. Keeping a second list is what silently stopped new
// rules from being loaded at all: the harness saw them, Biome did not.
writeFileSync(
  resolve(FIXTURES, 'biome.json'),
  `${JSON.stringify(
    {
      $schema: 'https://biomejs.dev/schemas/2.2.2/schema.json',
      javascript: { parser: { unsafeParameterDecoratorsEnabled: true } },
      linter: { enabled: true, rules: { recommended: false } },
      plugins: rules.map((rule) => `../plugins/${rule}.grit`),
    },
    null,
    '\t',
  )}\n`,
  'utf8',
)

function lint(target) {
  try {
    return execFileSync(BIOME, ['lint', target], { cwd: FIXTURES, encoding: 'utf8' })
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`

    if (output.trim() === '') {
      throw new Error(`could not run '${BIOME}': ${error.message}`)
    }

    return output
  }
}

const problems = []

for (const rule of rules) {
  // A rule about JSX needs a `.tsx` fixture, or the parser rejects the file
  // before any plugin sees it — and the failure reads as the rule misfiring.
  const find = (kind) =>
    ['ts', 'tsx']
      .map((extension) => `${kind}/${rule}.${extension}`)
      .find((file) => existsSync(resolve(FIXTURES, file)))

  const failing = find('fail')
  const passing = find('pass')

  for (const [kind, file] of [['fail', failing], ['pass', passing]]) {
    if (!file) {
      problems.push(`${rule}: missing fixtures/${kind}/${rule}.ts (or .tsx)`)
    }
  }

  if (problems.some((problem) => problem.startsWith(`${rule}:`))) {
    continue
  }

  const caught = lint(failing)

  if (caught.includes('Compile Error')) {
    problems.push(`${rule}: the plugin does not compile`)
    continue
  }

  if (!/×/.test(caught)) {
    problems.push(`${rule}: did not catch fixtures/fail/${rule}.ts`)
  }

  const leaked = lint(passing)

  if (/×/.test(leaked)) {
    // Naming the law that fired matters: the culprit is often a *different*
    // rule that is too loose, and "fired on the pass fixture" sends you to
    // read the wrong plugin.
    const laws = [...new Set([...leaked.matchAll(/×\s+([A-Z]{3}-[\w-]+):/g)].map((m) => m[1]))]

    problems.push(
      `${rule}: fixtures/pass/${rule}.ts is not clean — ${laws.join(', ') || 'a rule'} fired on it`,
    )
  }
}

if (problems.length > 0) {
  process.stdout.write(`\n✖ ${problems.length} fixture problem(s):\n`)
  for (const problem of problems) {
    process.stdout.write(`  ${problem}\n`)
  }
  process.stdout.write('\n')
  process.exitCode = 1
} else {
  process.stdout.write(
    `\n✓ ${rules.length} rule(s): each caught its own negative fixture, none fired on its positive one\n\n`,
  )
}
