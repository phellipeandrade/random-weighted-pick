import weightedPick, { WeightedInput, WeightedResult, RNG } from '../weightList'

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

/**
 * Quasi-aleatório determinístico para CI: cobre [0,1) de forma quase uniforme
 * usando amostragem estratificada. Evita flutuação binomial alta em testes estatísticos.
 */
export const makeQuasiRng = (totalCalls: number): RNG => {
  let i = 0
  return () => {
    // Amostra no centro de cada estrato para evitar cair exatamente em fronteiras
    const v = (i + 0.5) / totalCalls
    i = (i + 1) % totalCalls
    // Garante 0 <= v < 1
    return v >= 1 ? Number.MIN_VALUE : v
  }
}

export const generateItems = <T>(
  options: WeightedInput<T>[],
  times: number,
  rng?: RNG,
) => genLoop(times).map(() => weightedPick(options, rng ? { rng } : {}))
