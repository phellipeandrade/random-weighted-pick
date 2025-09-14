/**
 * Represents a weighted option for random selection
 * @template T The type of the item to be selected
 */
export interface WeightedOption<T> {
    /** Unique identifier for the option */
    id: number;
    /** Weight/probability of this option being selected (must sum to 1.0) */
    weight: number;
    /** The actual item/value to be returned when selected */
    item: T;
}
/**
 * Result of a weighted random selection
 * @template T The type of the selected item
 */
export interface WeightedResult<T> {
    /** ID of the selected option */
    id: number;
    /** The selected item */
    item: T;
}
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
declare const weightedList: <T>(options: WeightedOption<T>[]) => WeightedResult<T>;
export default weightedList;
//# sourceMappingURL=weightList.d.ts.map