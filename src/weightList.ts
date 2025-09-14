/** RNG function returning a float x where 0 <= x < 1 */
export type RNG = () => number

/** Configuration shared by all pickers */
export interface PickConfig {
  /** Normalize weights so that they sum 1. Defaults to `true` */
  normalize?: boolean
  /** Tolerance when checking weight sums. Defaults to `1e-12` */
  epsilon?: number
  /** Random number generator. Defaults to crypto or `Math.random` */
  rng?: RNG
}

export interface WeightedInput<T> {
  id?: number
  weight: number
  item: T
}

export interface WeightedResult<T> {
  id: number
  item: T
}

const throwTypeError = (msg: string): never => {
  throw new TypeError(msg)
}

const defaultRNG: RNG = () => {
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.getRandomValues) {
    const arr = new Uint32Array(1)
    ;(globalThis as any).crypto.getRandomValues(arr)
    return arr[0] / 0x100000000
  }
  return Math.random()
}

const validateOptions = <T>(options: ReadonlyArray<WeightedInput<T>>): Array<{ id: number; item: T; weight: number }> => {
  if (!Array.isArray(options)) {
    return throwTypeError('Weighted List expect Array of Objects as argument')
  }
  return options.map((opt, i) => {
    if (!('weight' in opt)) throwTypeError('Every list item should have [weight] property')
    if (!('item' in opt)) throwTypeError('Every list item should have [item] property')
    const w = opt.weight
    if (typeof w !== 'number' || Number.isNaN(w) || !Number.isFinite(w) || w < 0) {
      throwTypeError('Weights should be finite numbers >= 0')
    }
    return { id: opt.id ?? i, item: opt.item, weight: w }
  })
}

const normalize = (weights: number[], { normalize, epsilon }: Required<PickConfig>): number[] => {
  const total = weights.reduce((a, b) => a + b, 0)
  if (normalize) {
    if (total <= epsilon) throwTypeError("Sum of 'weights' should be greater than 0")
    return weights.map((w) => w / total)
  }
  if (Math.abs(total - 1) > epsilon) throwTypeError("Sum of 'weights' should be equal 1")
  return weights
}

/** Pick a single item based on its weight */
export function weightedPick<T>(
  options: ReadonlyArray<WeightedInput<T>>,
  cfg: PickConfig = {},
): WeightedResult<T> {
  const config: Required<PickConfig> = { normalize: true, epsilon: 1e-12, rng: defaultRNG, ...cfg }
  const opts = validateOptions(options)
  const weights = opts.map(o => o.weight)
  const normalized = normalize(weights, config)

  const num = config.rng()
  if (typeof num !== 'number' || Number.isNaN(num) || num < 0 || num >= 1) {
    throwTypeError('RNG should return a number x where 0 <= x < 1')
  }

  let acc = 0
  for (let i = 0; i < normalized.length; i++) {
    acc += normalized[i]
    if (num < acc) {
      return { id: opts[i].id, item: opts[i].item }
    }
  }
  return { id: opts[opts.length - 1].id, item: opts[opts.length - 1].item }
}

/** Pick `k` items. When `replacement` is false sampling is without replacement */
export function pickMany<T>(
  options: ReadonlyArray<WeightedInput<T>>,
  k: number,
  cfg: PickConfig & { replacement?: boolean } = {},
): Array<WeightedResult<T>> {
  const { replacement = true, ...rest } = cfg
  if (replacement) {
    return Array.from({ length: k }, () => weightedPick(options, rest))
  }

  const config: Required<PickConfig> = { normalize: true, epsilon: 1e-12, rng: defaultRNG, ...rest }
  const opts = validateOptions(options)
  const res: Array<{ key: number; option: typeof opts[number] }> = []
  opts.forEach((o) => {
    const r = config.rng()
    if (typeof r !== 'number' || Number.isNaN(r) || r <= 0 || r >= 1) {
      throwTypeError('RNG should return a number x where 0 < x < 1')
    }
    if (o.weight > 0) {
      const key = Math.pow(r, 1 / o.weight)
      res.push({ key, option: o })
    }
  })
  res.sort((a, b) => b.key - a.key)
  return res.slice(0, k).map(r => ({ id: r.option.id, item: r.option.item }))
}

export type Method = 'cdf' | 'alias'

/** Create a weighted picker for many fast selections */
export function createWeightedPicker<T>(
  options: ReadonlyArray<WeightedInput<T>>,
  cfg: PickConfig & { method?: Method } = {},
) {
  const { method = 'alias', ...rest } = cfg
  const config: Required<PickConfig> = { normalize: true, epsilon: 1e-12, rng: defaultRNG, ...rest }
  let opts = validateOptions(options)

  let probs: number[] = []
  let alias: number[] = []
  let cdf: number[] = []

  const build = () => {
    const weights = opts.map(o => o.weight)
    const normalized = normalize(weights, config)
    if (method === 'alias') {
      const n = normalized.length
      const scaled = normalized.map(w => w * n)
      const small: number[] = []
      const large: number[] = []
      probs = new Array(n).fill(0)
      alias = new Array(n).fill(0)
      scaled.forEach((w, i) => (w < 1 ? small : large).push(i))
      while (small.length && large.length) {
        const l = small.pop() as number
        const g = large.pop() as number
        probs[l] = scaled[l]
        alias[l] = g
        scaled[g] = scaled[g] + scaled[l] - 1
        if (scaled[g] < 1) small.push(g)
        else large.push(g)
      }
      ;[...large, ...small].forEach(i => (probs[i] = 1))
    } else {
      cdf = []
      let sum = 0
      normalized.forEach((w) => {
        sum += w
        cdf.push(sum)
      })
    }
  }

  build()

  const pick = (): WeightedResult<T> => {
    if (method === 'alias') {
      const n = opts.length
      const i = Math.floor(config.rng() * n)
      const r = config.rng()
      const idx = r < probs[i] ? i : alias[i]
      return { id: opts[idx].id, item: opts[idx].item }
    }
    const r = config.rng()
    if (typeof r !== 'number' || Number.isNaN(r) || r < 0 || r >= 1) {
      throwTypeError('RNG should return a number x where 0 <= x < 1')
    }
    let low = 0
    let high = cdf.length - 1
    while (low < high) {
      const mid = Math.floor((low + high) / 2)
      if (r < cdf[mid]) high = mid
      else low = mid + 1
    }
    return { id: opts[low].id, item: opts[low].item }
  }

  return {
    pick,
    pickMany: (k: number) => Array.from({ length: k }, () => pick()),
    updateWeight: (id: number, weight: number) => {
      const idx = opts.findIndex(o => o.id === id)
      if (idx === -1) throwTypeError('ID not found')
      if (typeof weight !== 'number' || Number.isNaN(weight) || !Number.isFinite(weight) || weight < 0) {
        throwTypeError('Weights should be finite numbers >= 0')
      }
      opts[idx].weight = weight
      build()
    },
  }
}

export default weightedPick
