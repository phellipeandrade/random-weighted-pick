import weightedPick, { pickMany, createWeightedPicker, } from './weightList.js';
export { weightedPick, pickMany, createWeightedPicker };
export default weightedPick;
if (typeof module !== 'undefined' && module?.exports) {
    module.exports = Object.assign(weightedPick, { weightedPick, pickMany, createWeightedPicker });
    module.exports.default = weightedPick;
}
