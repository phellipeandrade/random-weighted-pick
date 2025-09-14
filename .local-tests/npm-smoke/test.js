/* Smoke test for random-weighted-pick (CJS) */
const lib = require('random-weighted-pick')

// Library should expose default function and named exports
if (typeof lib !== 'function') {
  console.error('Default export is not a function')
  process.exit(1)
}

const { weightedPick, pickMany, createWeightedPicker } = lib

if (typeof weightedPick !== 'function' || typeof pickMany !== 'function' || typeof createWeightedPicker !== 'function') {
  console.error('Named exports missing')
  process.exit(1)
}

const options = [
  { id: 0, weight: 0.2, item: 'A' },
  { id: 1, weight: 0.3, item: 'B' },
  { id: 2, weight: 0.5, item: 'C' },
]

// Deterministic RNG for repeatability
let i = 0
const values = [0.05, 0.35, 0.85, 0.49, 0.51]
const rng = () => values[i++ % values.length]

// Single pick via default export
const one = lib(options, { rng })
console.log('one:', one)

// Single pick via named export
const one2 = weightedPick(options, { rng })
console.log('one2:', one2)

// Many picks
const many = pickMany(options, 3, { rng })
console.log('many:', many)

// Picker API
const picker = createWeightedPicker(options, { method: 'alias', rng })
const p1 = picker.pick()
const p2 = picker.pick()
const many2 = picker.pickMany(2)
console.log('picker:', { p1, p2, many2 })

// Basic assertions
const assertResult = r => {
  if (!r || typeof r.id !== 'number' || !['A', 'B', 'C'].includes(r.item)) {
    throw new Error('Invalid result shape: ' + JSON.stringify(r))
  }
}

assertResult(one)
assertResult(one2)
many.forEach(assertResult)
many2.forEach(assertResult)

console.log('Smoke test passed.')


