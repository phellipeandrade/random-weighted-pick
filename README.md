# 🎲 Random Weighted Pick

[![npm version](https://img.shields.io/npm/v/random-weighted-pick.svg?style=flat-square)](https://www.npmjs.com/package/random-weighted-pick)
[![npm downloads](https://img.shields.io/npm/dm/random-weighted-pick.svg?style=flat-square)](https://www.npmjs.com/package/random-weighted-pick)
[![CircleCI](https://img.shields.io/circleci/build/github/phellipeandrade/random-weighted-pick?style=flat-square)](https://circleci.com/gh/phellipeandrade/random-weighted-pick)
[![Coverage Status](https://img.shields.io/codecov/c/github/phellipeandrade/random-weighted-pick?style=flat-square)](https://codecov.io/gh/phellipeandrade/random-weighted-pick)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/random-weighted-pick?style=flat-square)](https://bundlephobia.com/result?p=random-weighted-pick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> A lightweight, zero-dependency utility for weighted random selection with full TypeScript support

## ✨ Features

- 🚀 **Zero Dependencies** - No external dependencies, minimal bundle size
- 📦 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- 🎯 **Tree Shakeable** - ES modules support for optimal bundle sizes
- 🔧 **Multiple Builds** - CommonJS, ES modules, and UMD builds included
- 🧪 **Well Tested** - Comprehensive test suite with 80%+ coverage
- 📚 **Fully Documented** - JSDoc comments and detailed examples
- ⚡ **High Performance** - Optimized algorithms for fast selection

## 📦 Installation

```bash
npm install random-weighted-pick
```

```bash
yarn add random-weighted-pick
```

```bash
pnpm add random-weighted-pick
```

## 🚀 Quick Start

### Basic Usage

```typescript
import weightedPick from 'random-weighted-pick';

const options = [
  { id: 1, weight: 0.2, item: 'Lemon' },
  { id: 2, weight: 0.3, item: 'Apple' },
  { id: 3, weight: 0.4, item: 'Mango' },
  { id: 4, weight: 0.1, item: 'Grape' }
];

const result = weightedPick(options);
console.log(result); // { id: 3, item: 'Mango' } (40% chance)
```

### Advanced Examples

#### Function Items
```typescript
const dynamicOptions = [
  { id: 1, weight: 0.5, item: () => 'Dynamic Value' },
  { id: 2, weight: 0.3, item: () => Math.random() },
  { id: 3, weight: 0.2, item: () => ({ message: 'Hello World' }) }
];

const result = weightedPick(dynamicOptions);
console.log(result.item()); // Executes the function and returns the result
```

#### Array Items
```typescript
const arrayOptions = [
  { id: 1, weight: 0.4, item: ['Red', 'Blue', 'Green'] },
  { id: 2, weight: 0.6, item: ['Circle', 'Square', 'Triangle'] }
];

const result = weightedPick(arrayOptions);
console.log(result); // { id: 1, item: ['Red', 'Blue', 'Green'] }
```

#### Complex Objects
```typescript
interface Prize {
  name: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const prizes: WeightedOption<Prize>[] = [
  { id: 1, weight: 0.5, item: { name: 'Gold Coin', value: 10, rarity: 'common' } },
  { id: 2, weight: 0.3, item: { name: 'Silver Ring', value: 50, rarity: 'rare' } },
  { id: 3, weight: 0.15, item: { name: 'Diamond', value: 200, rarity: 'epic' } },
  { id: 4, weight: 0.05, item: { name: 'Legendary Sword', value: 1000, rarity: 'legendary' } }
];

const prize = weightedPick(prizes);
console.log(`You won: ${prize.item.name} (${prize.item.rarity})`);
```

## 📖 API Reference

### `weightedPick<T>(options: WeightedOption<T>[]): WeightedResult<T>`

Selects a random item from a weighted list based on probability distribution.

#### Parameters

- `options` - Array of weighted options

#### Returns

A `WeightedResult<T>` object containing:
- `id: number` - The ID of the selected option
- `item: T` - The selected item

#### Throws

- `TypeError` - When options is not an array
- `TypeError` - When any option is missing required properties
- `TypeError` - When the sum of weights is not equal to 1

### Types

```typescript
interface WeightedOption<T> {
  /** Unique identifier for the option */
  id: number;
  /** Weight/probability of this option being selected (must sum to 1.0) */
  weight: number;
  /** The actual item/value to be returned when selected */
  item: T;
}

interface WeightedResult<T> {
  /** ID of the selected option */
  id: number;
  /** The selected item */
  item: T;
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Build in watch mode
npm run build:watch

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📊 Bundle Analysis

The library is optimized for minimal bundle size:

- **ES Module**: ~1.2KB gzipped
- **CommonJS**: ~1.3KB gzipped
- **UMD**: ~1.5KB gzipped

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for a simple, lightweight weighted random selection utility
- Built with ❤️ using TypeScript and modern tooling

---

<div align="center">
  <strong>⭐ Star this repository if you found it helpful! ⭐</strong>
</div>