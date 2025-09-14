# random-weighted-pick

[![npm](https://img.shields.io/npm/v/random-weighted-pick.svg)](https://www.npmjs.com/package/random-weighted-pick)
[![downloads](https://img.shields.io/npm/dm/random-weighted-pick.svg)](https://www.npmjs.com/package/random-weighted-pick)
[![bundle size](https://img.shields.io/bundlephobia/minzip/random-weighted-pick.svg)](https://bundlephobia.com/package/random-weighted-pick)
![types](https://img.shields.io/badge/types-TypeScript-3178C6?logo=typescript)
![module](https://img.shields.io/badge/module-ESM%20%26%20CJS-2ea44f)
![node](https://img.shields.io/node/v/random-weighted-pick.svg)
![deps](https://img.shields.io/badge/deps-0-brightgreen)
[![license](https://img.shields.io/npm/l/random-weighted-pick.svg)](./LICENSE)

Lightweight utility to pick random items from a weighted list, with probability proportional to each item's weight. Zero external deps. MIT licensed.

## Installation

```bash
npm install random-weighted-pick
```

- **Node**: `>=16`
- Supports **ESM** and **CommonJS**.

## Import

```ts
// ESM
import weightedPick, { pickMany, createWeightedPicker } from 'random-weighted-pick'

// CommonJS
// const { weightedPick, pickMany, createWeightedPicker } = require('random-weighted-pick')
// or: const weightedPick = require('random-weighted-pick')
```

## Quick start

```ts
const options = [
  { id: 0, weight: 0.2, item: () => 'Lemon' },
  { id: 1, weight: 0.3, item: ['Grape', 'Orange', 'Apple'] },
  { id: 2, weight: 0.4, item: 'Mango' },
  { id: 3, weight: 0.1, item: 3 },
]

// Weights are normalized automatically (sum does not need to be 1)
const one = weightedPick(options)
console.log(one) // { id: 2, item: 'Mango' }

// Pick multiple (with replacement by default)
const many = pickMany(options, 2)

// Pick multiple without replacement
const noReplacement = pickMany(options, 2, { replacement: false })

// Efficient picker for many selections (alias method by default)
const picker = createWeightedPicker(options, { method: 'alias' })
const next = picker.pick() // { id, item }
```

## API

### `weightedPick(options, config?) => { id: number, item: T }`
Pick 1 item according to its weight.

### `pickMany(options, k, config?) => Array<{ id: number, item: T }>`
Pick `k` items. When `replacement: false`, sampling is without replacement.

### `createWeightedPicker(options, config?)`
Create an optimized picker for multiple selections.

Returns an object with:
- `pick(): { id: number, item: T }`
- `pickMany(k: number): Array<{ id: number, item: T }>`
- `updateWeight(id: number, weight: number): void` — updates an item's weight and rebuilds internal structures.

## Types

```ts
export interface WeightedInput<T> {
  id?: number
  weight: number
  item: T
}

export interface WeightedResult<T> {
  id: number
  item: T
}

export type RNG = () => number

export interface PickConfig {
  normalize?: boolean // default: true
  epsilon?: number    // default: 1e-12
  rng?: RNG           // default: crypto.getRandomValues (when available) or Math.random
}

export type Method = 'cdf' | 'alias'
```

- `pickMany` also accepts `{ replacement?: boolean }`.
- `createWeightedPicker` accepts `{ method?: 'cdf' | 'alias' }`.

## Options and behavior

- **Normalization**: `normalize: true` by default. Weights are normalized to sum to 1. If `normalize: false`, the sum of weights must be 1 (± `epsilon`).
- **RNG**: defaults to `crypto.getRandomValues` when available; otherwise `Math.random`. You can inject a custom RNG.
- **Method**: `alias` is recommended for many fast selections; `cdf` uses binary search over the CDF.

## Advanced examples

### Custom RNG (deterministic for tests)
```ts
let i = 0
const values = [0.1, 0.8, 0.4]
const rng = () => values[i++ % values.length]

const result = pickMany([
  { id: 0, weight: 1, item: 'A' },
  { id: 1, weight: 1, item: 'B' },
], 2, { rng })
```

### Picker with `alias` method and weight updates
```ts
const picker = createWeightedPicker([
  { id: 0, weight: 1, item: 'A' },
  { id: 1, weight: 2, item: 'B' },
])

picker.pick()
picker.updateWeight(1, 5)
const batch = picker.pickMany(3)
```

### Sampling without replacement
```ts
const res = pickMany([
  { id: 0, weight: 1, item: 'A' },
  { id: 1, weight: 1, item: 'B' },
  { id: 2, weight: 1, item: 'C' },
], 2, { replacement: false })
```

## Errors and validations

- List must be an array of objects.
- Each item must have `weight` (finite number ≥ 0) and `item`.
- If `normalize: false`, the sum of weights must be 1 (± `epsilon`).
- RNG must return a number `x` in the range [0, 1), and for some internal cases (without replacement) it requires 0 < x < 1.

## Size, types and compatibility

- TypeScript types included (`types` in the ESM distribution).
- ESM and CJS exports configured via `package.json` (`exports`, `import`/`require`).

## Development

Requirements: Node 16+

```bash
# install dependencies
npm install

# tests
npm test

# coverage
npm run coverage

# build (ESM and CJS)
npm run build
```

## Contributing

See `CONTRIBUTING.md` for guidelines. Please ensure tests and build pass before opening a PR.

## License

MIT © KossHackaton OneTeam
