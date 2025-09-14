import weightedPick, {
  pickMany,
  createWeightedPicker,
  RNG,
  PickConfig,
  Method,
  WeightedInput,
  WeightedResult,
} from './weightList.js'

export type { RNG, PickConfig, Method, WeightedInput, WeightedResult }
export { weightedPick, pickMany, createWeightedPicker }
export default weightedPick

// Only define CommonJS exports when running under CJS environments
// This guard avoids ReferenceError in ESM where `module` is undefined
declare const module: any
if (typeof module !== 'undefined' && module?.exports) {
  module.exports = Object.assign(weightedPick, { weightedPick, pickMany, createWeightedPicker })
  module.exports.default = weightedPick
}
