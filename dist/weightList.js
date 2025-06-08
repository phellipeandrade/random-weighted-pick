"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = weightedList;
