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
const weightedList = <T>(options: WeightedOption<T>[]): WeightedResult<T> => {
  if (!Array.isArray(options)) {
    return throwTypeError('Weighted List expect Array of Objects as argument');
  }

  checkProperties(options, ['weight', 'item']);

  const weights = getProp(options, 'weight') as number[];
  const totalWeights = Number(weights.reduce((a, b) => a + b, 0).toPrecision(1));
  const num = Math.random();
  let set = 0;
  let selected: WeightedResult<T> | undefined;

  if (totalWeights !== 1) throwTypeError("Sum of 'weights' should be equal 1");

  weights.some((weight, i) => {
    set += weight;
    selected = selectOption(options, i);
    return num < set;
  });

  return selected!;
};

export default weightedList
