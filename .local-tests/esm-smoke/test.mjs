/* Smoke test for random-weighted-pick (ESM) */
import def, { weightedPick, pickMany, createWeightedPicker } from 'random-weighted-pick'

if (typeof def !== 'function') {
  console.error('Default export is not a function (ESM)')
  process.exit(1)
}

if (typeof weightedPick !== 'function' || typeof pickMany !== 'function' || typeof createWeightedPicker !== 'function') {
  console.error('Named exports missing (ESM)')
  process.exit(1)
}

const options = [
  { id: 0, weight: 0.2, item: 'A' },
  { id: 1, weight: 0.3, item: 'B' },
  { id: 2, weight: 0.5, item: 'C' },
]

let i = 0
const values = [0.05, 0.35, 0.85, 0.49, 0.51]
const rng = () => values[i++ % values.length]

const one = def(options, { rng })
console.log('esm:one:', one)

const one2 = weightedPick(options, { rng })
console.log('esm:one2:', one2)

const many = pickMany(options, 3, { rng })
console.log('esm:many:', many)

const picker = createWeightedPicker(options, { method: 'alias', rng })
const p1 = picker.pick()
const p2 = picker.pick()
const many2 = picker.pickMany(2)
console.log('esm:picker:', { p1, p2, many2 })

const assertResult = r => {
  if (!r || typeof r.id !== 'number' || !['A', 'B', 'C'].includes(r.item)) {
    throw new Error('Invalid result shape: ' + JSON.stringify(r))
  }
}

assertResult(one)
assertResult(one2)
many.forEach(assertResult)
many2.forEach(assertResult)

console.log('ESM smoke test passed.')


