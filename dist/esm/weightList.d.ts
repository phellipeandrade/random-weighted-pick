/** RNG function returning a float x where 0 <= x < 1 */
export type RNG = () => number;
/** Configuration shared by all pickers */
export interface PickConfig {
    /** Normalize weights so that they sum 1. Defaults to `true` */
    normalize?: boolean;
    /** Tolerance when checking weight sums. Defaults to `1e-12` */
    epsilon?: number;
    /** Random number generator. Defaults to crypto or `Math.random` */
    rng?: RNG;
}
export interface WeightedInput<T> {
    id?: number;
    weight: number;
    item: T;
}
export interface WeightedResult<T> {
    id: number;
    item: T;
}
/** Pick a single item based on its weight */
export declare function weightedPick<T>(options: ReadonlyArray<WeightedInput<T>>, cfg?: PickConfig): WeightedResult<T>;
/** Pick `k` items. When `replacement` is false sampling is without replacement */
export declare function pickMany<T>(options: ReadonlyArray<WeightedInput<T>>, k: number, cfg?: PickConfig & {
    replacement?: boolean;
}): Array<WeightedResult<T>>;
export type Method = 'cdf' | 'alias';
/** Create a weighted picker for many fast selections */
export declare function createWeightedPicker<T>(options: ReadonlyArray<WeightedInput<T>>, cfg?: PickConfig & {
    method?: Method;
}): {
    pick: () => WeightedResult<T>;
    pickMany: (k: number) => WeightedResult<T>[];
    updateWeight: (id: number, weight: number) => void;
};
export default weightedPick;
