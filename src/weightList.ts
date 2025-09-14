export interface WeightedOption<T> {
  id: number
  weight: number
  item: T
}

export interface WeightedResult<T> {
  id: number
  item: T
}

export interface WeightedListOptions {
  normalize?: boolean
  epsilon?: number
  rng?: () => number
  uniqueIds?: boolean
}

const selectOption = <T>(arr: WeightedOption<T>[], i: number): WeightedResult<T> => ({
  id: arr[i].id,
  item: arr[i].item,
})

const getProp = <T, K extends keyof WeightedOption<T>>(arr: WeightedOption<T>[], prop: K): WeightedOption<T>[K][] =>
  arr.map(opt => opt[prop])

const checkProperty = <T>(arr: WeightedOption<T>[], prop: keyof WeightedOption<T>): boolean =>
  arr.every(item => Object.prototype.hasOwnProperty.call(item, prop))

const propErrorMsg = (prop: string) => `Every list item should have [${prop}] property`

const checkProperties = <T>(options: WeightedOption<T>[], props: (keyof WeightedOption<T>)[]) =>
  props.map((prop) => {
    if (!checkProperty(options, prop)) {
      throw new TypeError(propErrorMsg(String(prop)))
    }
    return true as const
  })

const throwTypeError = (msg: string): never => {
  throw new TypeError(msg)
}

const defaultRNG = (): number => {
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.getRandomValues) {
    const arr = new Uint32Array(1)
    ;(globalThis as any).crypto.getRandomValues(arr)
    return arr[0] / 0x100000000
  }
  return Math.random()
}

const weightedList = <T>(options: WeightedOption<T>[], config: WeightedListOptions = {}): WeightedResult<T> => {
  if (!Array.isArray(options)) {
    return throwTypeError('Weighted List expect Array of Objects as argument')
  }

  checkProperties(options, ['weight', 'item'])

  const { normalize = true, epsilon = 1e-12, rng = defaultRNG, uniqueIds = false } = config

  const weights = getProp(options, 'weight') as number[]

  weights.forEach((w) => {
    if (typeof w !== 'number' || Number.isNaN(w) || !Number.isFinite(w) || w < 0) {
      throwTypeError('Weights should be finite numbers >= 0')
    }
  })

  if (uniqueIds) {
    const ids = getProp(options, 'id') as number[]
    const setIds = new Set(ids)
    if (setIds.size !== ids.length) throwTypeError('IDs should be unique')
  }

  const totalWeights = weights.reduce((a, b) => a + b, 0)
  let normalizedWeights = weights

  if (normalize) {
    if (totalWeights <= epsilon) throwTypeError("Sum of 'weights' should be greater than 0")
    normalizedWeights = weights.map((w) => w / totalWeights)
  } else {
    if (Math.abs(totalWeights - 1) > epsilon) {
      throwTypeError(`Sum of 'weights' should be equal 1`)
    }
  }

  const num = rng()
  if (typeof num !== 'number' || Number.isNaN(num) || num < 0 || num >= 1) {
    throwTypeError('RNG should return a number x where 0 <= x < 1')
  }
  let set = 0
  let selected: WeightedResult<T> | undefined

  normalizedWeights.some((weight, i) => {
    set += weight
    selected = selectOption(options, i)
    return num < set
  })

  return selected!
}

export default weightedList
