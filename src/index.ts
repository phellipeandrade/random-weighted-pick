import weightedPick, {
  pickMany,
  createWeightedPicker,
  RNG,
  PickConfig,
  Method,
  WeightedInput,
  WeightedResult,
} from './weightList'

export type { RNG, PickConfig, Method, WeightedInput, WeightedResult }
export { weightedPick, pickMany, createWeightedPicker }
export default weightedPick

declare const module: any
module.exports = Object.assign(weightedPick, { weightedPick, pickMany, createWeightedPicker })
module.exports.default = weightedPick
