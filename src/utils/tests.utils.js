import weightList from '../weightList';

export const defaultTimes = 200;

export const genLoop = number => Array(number || defaultTimes).fill();

export const defaultLoop = genLoop();

export const getTimesGenerated = map => map.reduce((obj, b) => {
  obj[b.id] = ++obj[b.id] || 1;
  return obj;
}, {});

export const between = (x, min, max) => x >= min && x <= max;

export const diff = (a, b) => Math.abs(a - b);

export const calculatePercent = (portion, total, precision = 2) => 
  Number(((portion / total) * 100).toFixed(precision));

export const generateItems = (options, times) => genLoop(times).map(() => weightList(options));
