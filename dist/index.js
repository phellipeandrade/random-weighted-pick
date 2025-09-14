'use strict';

const selectOption = (arr, i) => ({
    id: arr[i].id,
    item: arr[i].item,
});
const getProp = (arr, prop) => arr.map(opt => opt[prop]);
const checkProperty = (arr, prop) => arr.every(item => Object.prototype.hasOwnProperty.call(item, prop));
const propErrorMsg = (prop) => `Every list item should have [${prop}] property`;
const checkProperties = (options, props) => props.map((prop) => {
    if (!checkProperty(options, prop)) {
        throw new TypeError(propErrorMsg(String(prop)));
    }
    return true;
});
const throwTypeError = (msg) => {
    throw new TypeError(msg);
};
/**
 * Selects a random item from a weighted list based on probability distribution
 *
 * @template T The type of items in the weighted list
 * @param options Array of weighted options where each option has an id, weight, and item
 * @returns A WeightedResult containing the selected item and its ID
 *
 * @example
 * ```typescript
 * const options = [
 *   { id: 1, weight: 0.3, item: 'Apple' },
 *   { id: 2, weight: 0.7, item: 'Banana' }
 * ];
 * const result = weightedList(options);
 * console.log(result); // { id: 2, item: 'Banana' } (70% chance)
 * ```
 *
 * @throws {TypeError} When options is not an array
 * @throws {TypeError} When any option is missing required properties
 * @throws {TypeError} When the sum of weights is not equal to 1
 */
const weightedList = (options) => {
    if (!Array.isArray(options)) {
        return throwTypeError('Weighted List expect Array of Objects as argument');
    }
    checkProperties(options, ['weight', 'item']);
    const weights = getProp(options, 'weight');
    const totalWeights = Number(weights.reduce((a, b) => a + b, 0).toPrecision(1));
    const num = Math.random();
    let set = 0;
    let selected;
    if (totalWeights !== 1)
        throwTypeError("Sum of 'weights' should be equal 1");
    weights.some((weight, i) => {
        set += weight;
        selected = selectOption(options, i);
        return num < set;
    });
    return selected;
};

module.exports = weightedList;
//# sourceMappingURL=index.js.map
