export interface WeightedOption<T> {
    id: number;
    weight: number;
    item: T;
}
export interface WeightedResult<T> {
    id: number;
    item: T;
}
declare const weightedList: <T>(options: WeightedOption<T>[]) => WeightedResult<T>;
export default weightedList;
