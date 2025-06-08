import weightList, { WeightedOption, WeightedResult } from '../weightList'

export const defaultTimes = 200

export const genLoop = (number: number = defaultTimes) => Array(number).fill(undefined)

export const defaultLoop = genLoop()

export const getTimesGenerated = (map: WeightedResult<any>[]) => map.reduce((obj: Record<number, number>, b) => {
  obj[b.id] = ++obj[b.id] || 1
  return obj
}, {})

export const between = (x: number, min: number, max: number) => x >= min && x <= max

export const diff = (a: number, b: number) => Math.abs(a - b)

export const calculatePercent = (portion: number, total: number, precision = 2) =>
  Number(((portion / total) * 100).toFixed(precision))

export const generateItems = <T>(options: WeightedOption<T>[], times: number) => genLoop(times).map(() => weightList(options))
