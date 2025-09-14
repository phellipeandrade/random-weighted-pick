import { describe, expect, it } from '@jest/globals';
import weightedPick, { pickMany, createWeightedPicker } from './weightList';
import {
  defaultLoop,
  getTimesGenerated,
  between,
  calculatePercent,
  generateItems,
} from './utils/tests.utils';

const times = 100000;

describe('weight list', () => {

  it('should be a function', () => {
    expect(typeof weightedPick).toBe('function');
  });

  it('should return always same input when just 1 weight is > 0', () => {
    const options = [
      { id: 0, weight: 0, item: 'Mango' },
      { id: 1, weight: 1, item: 'Apple' },
    ];
    const before = { id: 1, item: 'Apple' };
    defaultLoop.map(() => expect(weightedPick(options)).toEqual(before));
  });

  it('should return same item about ±50% when exists 2 items with 0.5 weight each', () => {
    const options = [
      { id: 0, weight: 0.5, item: 'Mango' },
      { id: 1, weight: 0.5, item: 'Apple' },
    ];
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 49.5, 50.5);
    expect(isBetween).toBe(true);
  });

  it('should normalize weights automatically', () => {
    const options = [
      { id: 0, weight: 5, item: 'Mango' },
      { id: 1, weight: 5, item: 'Apple' },
    ];
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 49.5, 50.5);
    expect(isBetween).toBe(true);
  });

  it('should return same item about ±30% when exists 3 items with 0.3333333333333333 weight each', () => {
    const options = [
      { id: 0, weight: 0.3333333333333333, item: 'Mango' },
      { id: 1, weight: 0.3333333333333333, item: 'Apple' },
      { id: 2, weight: 0.3333333333333333, item: 'Strawberry' },
    ];
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 32.5, 33.70);
    expect(isBetween).toBe(true);
  });

  it('should return same item about ±10% when exists 2 items with 0.1 and 0.9 weight respectively', () => {
    const options = [
      { id: 0, weight: 0.1, item: 'Mango' },
      { id: 1, weight: 0.9, item: 'Apple' },
    ];
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 9.8, 10.5);
    expect(isBetween).toBe(true);
  });

  it('should return same item about ±10% when exists 10 items with 0.1 weight respectively', () => {
    const options: { id: number; weight: number; item: number }[] = [];
    Array(10).fill(undefined).map((v, i) => options.push({ id: i, weight: 0.1, item: i }));
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 9.8, 10.7);
    expect(isBetween).toBe(true);
  });

  it('should return same item about ±10% when exists 20 items with 0.05 weight respectively', () => {
    const options: { id: number; weight: number; item: number }[] = [];
    Array(20).fill(undefined).map((v, i) => options.push({ id: i, weight: 0.05, item: i }));
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 4.7, 5.3);
    expect(isBetween).toBe(true);
  });

});

describe('Input Error Handlers', () => {

  it('should throw Type Error: Options list should be an Array', () => {
    expect(() => weightedPick({} as any)).toThrow(new TypeError('Weighted List expect Array of Objects as argument'));
  });

  it('should throw Type Error: Every list item should have [weight] property', () => {
    const options = [{ id: 0 }] as any;
    expect(() => weightedPick(options)).toThrow(new TypeError('Every list item should have [weight] property'));
  });

  it('should throw Type Error: Every list item should have [item] property', () => {
    const options = [{ id: 0, weight: 0.2 }] as any;
    expect(() => weightedPick(options)).toThrow(new TypeError('Every list item should have [item] property'));
  });

  it("Sum of weights should be equal 1", () => {
    const options = [{ weight: 0.9, item: 'U.S Callister' }] as any;
    expect(() => weightedPick(options, { normalize: false })).toThrow(new TypeError("Sum of 'weights' should be equal 1"));
  });

  it('should throw Type Error: Weights should be finite numbers >= 0', () => {
    const options = [{ id: 0, weight: -1, item: 'Bad' }];
    expect(() => weightedPick(options)).toThrow(new TypeError('Weights should be finite numbers >= 0'));
  });

});

describe('pickMany and createWeightedPicker', () => {
  it('pickMany without replacement returns unique items', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
      { id: 2, weight: 1, item: 'C' },
    ];
    const rngValues = [0.1, 0.8, 0.4];
    let i = 0;
    const rng = () => rngValues[i++ % rngValues.length];
    const result = pickMany(options, 2, { replacement: false, rng });
    expect(result.length).toBe(2);
    expect(result[0].id).not.toBe(result[1].id);
  });

  it('createWeightedPicker with alias method picks items', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
    ];
    const rngValues = [0.1, 0.9, 0.2, 0.8];
    let i = 0;
    const rng = () => rngValues[i++ % rngValues.length];
    const picker = createWeightedPicker(options, { rng, method: 'alias' });
    const picks = picker.pickMany(2);
    expect(picks.length).toBe(2);
  });
});

describe('RNG and additional validations', () => {
  it('weightedPick should throw when rng returns out of range (>= 1)', () => {
    const options = [
      { weight: 0.5, item: 'A' },
      { weight: 0.5, item: 'B' },
    ] as any;
    const rng = () => 1;
    expect(() => weightedPick(options, { rng })).toThrow(new TypeError('RNG should return a number x where 0 <= x < 1'));
  });

  it('pickMany without replacement should throw when rng returns 0 (requires 0 < x < 1)', () => {
    const options = [
      { weight: 1, item: 'A' },
      { weight: 1, item: 'B' },
    ];
    const rng = () => 0;
    expect(() => pickMany(options as any, 2, { replacement: false, rng })).toThrow(new TypeError('RNG should return a number x where 0 < x < 1'));
  });

  it('normalize:false respects epsilon tolerance (no throw within epsilon)', () => {
    const options = [
      { weight: 0.6, item: 'A' },
      { weight: 0.4000005, item: 'B' }, // sum = 1.0000005
    ];
    const rng = () => 0.1;
    expect(() => weightedPick(options as any, { normalize: false, epsilon: 1e-6, rng })).not.toThrow();
  });

  it('normalize:false throws when sum differs by more than epsilon', () => {
    const options = [
      { weight: 0.6, item: 'A' },
      { weight: 0.41, item: 'B' }, // sum = 1.01
    ];
    expect(() => weightedPick(options as any, { normalize: false, epsilon: 1e-3 })).toThrow(new TypeError("Sum of 'weights' should be equal 1"));
  });
});

describe('createWeightedPicker with CDF and updateWeight', () => {
  it('updateWeight affects subsequent picks (CDF)', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
    ];
    let calls = 0;
    const rngSeq = [0.99, 0.01, 0.01, 0.01];
    const rng = () => rngSeq[calls++ % rngSeq.length];
    const picker = createWeightedPicker(options, { method: 'cdf', rng });

    const before = picker.pick(); // with r=0.99 and equal weights, should tend to pick id:1
    expect([0, 1]).toContain(before.id);

    picker.updateWeight(1, 0);
    const after = picker.pick();
    expect(after.id).toBe(0);
    const manyAfter = picker.pickMany(5);
    expect(manyAfter.every(x => x.id === 0)).toBe(true);
  });

  it('updateWeight throws for unknown id', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
    ];
    const picker = createWeightedPicker(options, { method: 'cdf' });
    expect(() => (picker as any).updateWeight(99, 2)).toThrow(new TypeError('ID not found'));
  });

  it('updateWeight throws for invalid weight (< 0)', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
    ];
    const picker = createWeightedPicker(options, { method: 'cdf' });
    expect(() => (picker as any).updateWeight(1, -1)).toThrow(new TypeError('Weights should be finite numbers >= 0'));
  });
});

describe('Behavior: zero weight and default id', () => {
  it('alias picker should never select zero-weight items', () => {
    const options = [
      { id: 0, weight: 0, item: 'Z' },
      { id: 1, weight: 1, item: 'A' },
    ];
    const rngValues = [0.1, 0.9, 0.2, 0.8];
    let i = 0;
    const rng = () => rngValues[i++ % rngValues.length];
    const picker = createWeightedPicker(options, { method: 'alias', rng });
    const picks = picker.pickMany(50);
    const ids = picks.map(x => x.id);
    expect(ids.every(id => id !== 0)).toBe(true);
  });

  it('default id falls back to array index when not provided', () => {
    const options = [
      { weight: 0, item: 'Z' },
      { weight: 1, item: 'A' },
    ];
    const result = weightedPick(options as any);
    expect(result.id).toBe(1);
    expect(result.item).toBe('A');
  });
});

describe('pickMany without replacement with k > n', () => {
  it('returns at most n unique items', () => {
    const options = [
      { id: 0, weight: 1, item: 'A' },
      { id: 1, weight: 1, item: 'B' },
      { id: 2, weight: 1, item: 'C' },
    ];
    const rngValues = [0.1, 0.9, 0.2, 0.8, 0.3];
    let i = 0;
    const rng = () => rngValues[i++ % rngValues.length];
    const res = pickMany(options, 5, { replacement: false, rng });
    expect(res.length).toBe(3);
    const unique = new Set(res.map(x => x.id));
    expect(unique.size).toBe(3);
  });
});
