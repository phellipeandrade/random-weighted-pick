export interface WeightedOption<T> {
  id: number
  weight: number
  item: T
}

export interface WeightedResult<T> {
  id: number
  item: T
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

const weightedList = <T>(options: WeightedOption<T>[]): WeightedResult<T> => {
  if (!Array.isArray(options)) {
    return throwTypeError('Weighted List expect Array of Objects as argument')
  }

  checkProperties(options, ['weight', 'item'])

  const weights = getProp(options, 'weight') as number[]
  const totalWeights = Number(weights.reduce((a, b) => a + b, 0).toPrecision(1))
  const num = Math.random()
  let set = 0
  let selected: WeightedResult<T> | undefined

  if (totalWeights !== 1) throwTypeError("Sum of 'weights' should be equal 1")

  weights.some((weight, i) => {
    set += weight
    selected = selectOption(options, i)
    return num < set
  })

  return selected!
}

export default weightedList
