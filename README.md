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

- **Lightweight & fast**: zero dependencies, tree-shakable
- **Typed**: full TypeScript types
- **Flexible**: sampling with/without replacement, pluggable RNG
- **Efficient**: optimized picker via Alias method or CDF

## Installation

```bash
npm install random-weighted-pick
```

- **Node**: `>=16`
- Supports **ESM** and **CommonJS**

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

// Weights are automatically normalized (sum does not need to be 1)
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
- `updateWeight(id: number, weight: number): void` — updates an item's weight and rebuilds internal structures

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

### Complexity and algorithms

- `weightedPick` (implicit CDF scan): O(n) to accumulate + O(n) worst-case scan; fast for small lists.
- `createWeightedPicker` with `alias`:
  - Build: O(n)
  - `pick()`: O(1)
- `createWeightedPicker` with `cdf`:
  - Build: O(n)
  - `pick()`: O(log n) via binary search
- `pickMany(..., { replacement: false })`: uses weighted random keys (Efraimidis–Spirakis). Generate keys, sort, take top `k` — O(n log n).

## How it works (under the hood)

### Normalization and numeric stability

- Let raw weights be `w[i] >= 0`. When `normalize: true` (default), probabilities are `p[i] = w[i] / sum(w)`.
- If `normalize: false`, the library expects `|sum(w) - 1| <= epsilon` and throws otherwise.
- `epsilon` (default `1e-12`) is used to tolerate floating‑point rounding when checking `sum(w)`.
- Items with `weight = 0` are never selected. If all weights are zero, an error is thrown.

### `weightedPick` with CDF scan

1. Compute normalized probabilities `p[0..n-1]`.
2. Draw `r` from RNG (`0 <= r < 1`). If not, throw.
3. Find the smallest index `j` where cumulative sum `S[j] = p[0] + ... + p[j]` satisfies `r < S[j]`.
   - Intuition: the unit interval is partitioned into segments of lengths `p[i]` and we land where `r` falls.

### `createWeightedPicker` with CDF (binary search)

1. Build the cumulative distribution array `cdf` once.
2. For each pick: draw `r` in `[0, 1)`, then binary‑search the smallest index `j` with `r < cdf[j]`.
3. Complexity: build `O(n)`, pick `O(log n)`.

### `createWeightedPicker` with Alias method (Vose/Walker)

Build step (once):

1. Normalize probabilities `p[i]` and scale by `n`: `q[i] = p[i] * n`.
2. Split indices into `small = { i | q[i] < 1 }` and `large = { i | q[i] >= 1 }`.
3. While both sets are non‑empty:
   - Pop `l` from `small` and `g` from `large`.
   - Set `prob[l] = q[l]` and `alias[l] = g`.
   - Update `q[g] = q[g] + q[l] - 1` and move `g` between sets accordingly.
4. Set remaining `prob[i] = 1` for indices left in either set.

Pick step (each selection):

1. Draw `r1` and `r2` in `[0, 1)`.
2. Compute `i = floor(r1 * n)`.
3. If `r2 < prob[i]` pick `i`, else pick `alias[i]`.

Minimal numerical example (2 items): weights `[0.25, 0.75]`, `n=2` → scaled `q = [0.5, 1.5]`.
- `small = [0]`, `large = [1]` → set `prob[0] = 0.5`, `alias[0] = 1`; remaining `prob[1] = 1`.
- When `i=0`, `r2 < 0.5` selects `0`; otherwise selects `1` via alias.

### Sampling without replacement (Efraimidis–Spirakis)

To select `k` items without replacement, the library uses weighted random keys:

1. For each item `i` with weight `w[i] > 0`, draw `u[i]` with `0 < u[i] < 1`.
2. Compute `key[i] = u[i]^(1 / w[i])`. Larger `key` means higher priority.
3. Sort by `key` descending and return the top‑`k` items.

Notes:
- This requires a strict `0 < u < 1` (not including endpoints). The library validates this and throws if violated.
- Equivalent form using logs: `key = exp((ln u) / w)`, which is numerically similar but the direct power is used here.

### RNG and reproducibility

- By default, the RNG is `crypto.getRandomValues` (when available) or `Math.random`.
- You can inject a custom RNG via `PickConfig.rng`. Tests become deterministic by cycling through a fixed array of values.

### Worked examples

- CDF pick with weights `[2, 1, 1]`:
  - Normalized `p = [0.5, 0.25, 0.25]` and `S = [0.5, 0.75, 1]`.
  - `r = 0.10` → `r < 0.5` → pick index `0`.
  - `r = 0.60` → `0.5 <= r < 0.75` → pick index `1`.
  - `r = 0.90` → `0.75 <= r < 1` → pick index `2`.
- Alias pick with `[0.25, 0.75]` (as above): `prob = [0.5, 1]`, `alias[0] = 1`.
  - `r1 = 0.0 → i = 0`, `r2 = 0.4 < 0.5` → pick `0`.
  - `r1 = 0.0 → i = 0`, `r2 = 0.9 >= 0.5` → pick `alias[0] = 1`.

## Glossary

- CDF (Cumulative Distribution Function): for a discrete distribution with probabilities `p[i]`, the CDF at index `j` is `S[j] = p[0] + ... + p[j]`. Sampling with a uniform `r \in [0,1)` returns the smallest `j` such that `r < S[j]`.
- PMF (Probability Mass Function): the set of probabilities `p[i]` assigned to discrete outcomes. Here, `p[i]` comes from normalized weights.
- Alias method (Vose/Walker): `O(1)` sampling scheme that preprocesses probabilities into two tables (`prob` and `alias`) so each draw is constant time.
- RNG (Random Number Generator): function returning floats in `[0, 1)`. Defaults to `crypto.getRandomValues` (when available) or `Math.random`, and can be injected via `PickConfig.rng`.
- Normalization: scaling raw weights `w[i]` to probabilities `p[i] = w[i] / sum(w)` so they sum to 1.
- Epsilon (`epsilon`): small tolerance used when comparing floating‑point sums to 1 in `normalize: false` mode.
- Replacement: sampling with replacement allows the same item to appear multiple times; without replacement each selected item appears at most once.
- Weighted random keys (Efraimidis–Spirakis): method for sampling without replacement using `key = u^(1/w)` with `u \in (0,1)`, selecting the top‑`k` keys.

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
- Works in browsers when bundled (uses `crypto.getRandomValues` when available). For environments without `crypto`, inject your own RNG.

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
