import { describe, expect, it } from '@jest/globals';
import weightedPick, { pickMany, createWeightedPicker } from './weightList';

const makeRng = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('Deterministic CDF picker boundaries', () => {
  it('picks expected indices at CDF boundaries', () => {
    const options = [
      { id: 0, weight: 0.2, item: 'A' },
      { id: 1, weight: 0.3, item: 'B' },
      { id: 2, weight: 0.5, item: 'C' },
    ];
    const rng = makeRng([
      0.0,      // -> id 0
      0.199999, // -> id 0
      0.2,      // boundary -> id 1
      0.49999,  // -> id 1
      0.5,      // boundary -> id 2
      0.9999,   // -> id 2
    ]);
    const picker = createWeightedPicker(options, { method: 'cdf', rng });
    expect(picker.pick().id).toBe(0);
    expect(picker.pick().id).toBe(0);
    expect(picker.pick().id).toBe(1);
    expect(picker.pick().id).toBe(1);
    expect(picker.pick().id).toBe(2);
    expect(picker.pick().id).toBe(2);
  });
});

describe('Deterministic Alias picker branching', () => {
  it('forces both branches (probs[i] vs alias[i])', () => {
    // Weights chosen so that scaled probs create a non-trivial alias table
    // With [0.25, 0.75] and n=2: probs[0] ~ 0.5, alias[0] = 1, probs[1] = 1
    const options = [
      { id: 0, weight: 0.25, item: 'A' },
      { id: 1, weight: 0.75, item: 'B' },
    ];
    const rng = makeRng([
      0.0, // i = 0
      0.4, // r < probs[0] (0.5) -> pick id 0
      0.0, // i = 0
      0.9, // r >= probs[0] -> pick alias[0] which is id 1
    ]);
    const picker = createWeightedPicker(options, { method: 'alias', rng });
    expect(picker.pick().id).toBe(0);
    expect(picker.pick().id).toBe(1);
  });
});

describe('Deterministic pickMany (with replacement)', () => {
  it('uses RNG sequence to pick predictable items', () => {
    const options = [
      { id: 0, weight: 0.7, item: 'A' },
      { id: 1, weight: 0.3, item: 'B' },
    ];
    const rng = makeRng([0.05, 0.95, 0.6, 0.2]);
    const res = pickMany(options, 4, { rng });
    expect(res.map(r => r.id)).toEqual([0, 1, 0, 0]);
  });
});

describe('Deterministic pickMany (without replacement)', () => {
  it('selects top-k by deterministic weighted keys order', () => {
    // rng is consumed once per item in options order. Keys: r^(1/w)
    const options = [
      { id: 0, weight: 1, item: 'A' },    // key = 0.1
      { id: 1, weight: 2, item: 'B' },    // key = sqrt(0.2)
      { id: 2, weight: 3, item: 'C' },    // key = 0.3^(1/3)
      { id: 3, weight: 0.5, item: 'D' },  // key = 0.4^(1/0.5) = 0.4^2 = 0.16
    ];
    const rng = makeRng([0.1, 0.2, 0.3, 0.4]);
    const res = pickMany(options, 2, { replacement: false, rng });
    // Expected ordering by keys desc: id 2 (~0.669), id 1 (~0.447), id 3 (0.16), id 0 (0.1)
    expect(res.map(r => r.id)).toEqual([2, 1]);
  });
});

describe('Deterministic weightedPick normalization on boundaries', () => {
  it('picks first/last for rng extremal values', () => {
    const options = [
      { weight: 0.2, item: 'A' },
      { weight: 0.3, item: 'B' },
      { weight: 0.5, item: 'C' },
    ] as any;
    const rng = makeRng([0.0, 0.999999999]);
    const first = weightedPick(options, { rng });
    const last = weightedPick(options, { rng });
    expect(first.item).toBe('A');
    expect(last.item).toBe('C');
  });
});


