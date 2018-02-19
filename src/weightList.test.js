import { expect } from 'chai';
import weightList from './weightList';
import {
  defaultLoop,
  getTimesGenerated,
  between,
  calculatePercent,
  generateItems,
} from '../src/utils/tests.utils';

const times = 100000;

describe('weight list', () => {

  it('should be a function', () => {
    expect(weightList).to.be.an('function');
  });

  it('should return always same input when just 1 weight is > 0', () => {
    const options = [
      { id: 0, weight: 0, item: 'Mango' },
      { id: 1, weight: 1, item: 'Apple' },
    ];
    const before = { id: 1, item: 'Apple' };
    defaultLoop.map(() => expect(weightList(options)).to.be.deep.equal(before));
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
    expect(isBetween).to.be.equal(true);
  });

  it('should return same item about ±30% when exists 3 items with 0.3333333333333333 weight each', () => {
    const options = [
      { id: 0, weight: 0.3333333333333333, item: 'Mango' },
      { id: 1, weight: 0.3333333333333333, item: 'Apple' },
      { id: 1, weight: 0.3333333333333333, item: 'Strawberry' },
    ];
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 32.5, 33.70);
    expect(isBetween).to.be.equal(true);
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
    expect(isBetween).to.be.equal(true);
  });

  it('should return same item about ±10% when exists 10 items with 0.1 weight respectively', () => {
    const options = [];
    Array(10).fill().map((v, i) => options.push({ id: i, weight: 0.1, item: i }));
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 9.8, 10.7);
    expect(isBetween).to.be.equal(true);
  });

  it('should return same item about ±10% when exists 20 items with 0.05 weight respectively', () => {
    const options = [];
    Array(20).fill().map((v, i) => options.push({ id: i, weight: 0.05, item: i }));
    const generatedItems = generateItems(options, times);
    const timesGenerated = getTimesGenerated(generatedItems);
    const percentage = calculatePercent(timesGenerated[0], times);
    const isBetween = between(percentage, 4.9, 5.3);
    expect(isBetween).to.be.equal(true);
  });

});

describe('Input Error Handlers', () => {
    
  it('should throw Type Error: Options list should be an Array', () => {
    expect(() => weightList({})).to.throw(TypeError, 'Weighted List expect Array of Objects as argument');
  });

  it('should throw Type Error: Every list item should have [weight] property', () => {
    const options = [{ id: 0 }];
    expect(() => weightList(options)).to.throw(TypeError, 'Every list item should have [weight] property');
  });

  it('should throw Type Error: Every list item should have [item] property', () => {
    const options = [{ id: 0, weight: 0.2 }];
    expect(() => weightList(options)).to.throw(TypeError, 'Every list item should have [item] property');
  });

  it('Sum of weights should be equal 1', () => {
    const options = [{ weight: 0.9, item: 'U.S Callister' }];
    expect(() => weightList(options)).to.throw(TypeError, "Sum of 'weights' should be equal 1");
  });

});
