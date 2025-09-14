# random-weighted-pick

[![Greenkeeper badge](https://badges.greenkeeper.io/phellipeandrade/random-weighted-pick.svg)](https://greenkeeper.io/)
A lightweight utility that allows you to easily choose a random item from a weighted list of items, with a probability dependent on their weight.

this module has no external dependencies and is licensed under the MIT License.

![](https://circleci.com/gh/phellipeandrade/random-weighted-pick.svg?circle-token=419638ce524623e596d38a5ce25953266255c9a4)

![](http://img.badgesize.io/https://raw.githubusercontent.com/phellipeandrade/random-weighted-pick/master/dist/index.js)  [![codebeat badge](https://codebeat.co/badges/2472237c-3e96-4098-928f-9762db4b2b4d)](https://codebeat.co/projects/github-com-phellipeandrade-random-weighted-pick-master-71204f75-a323-42b3-a9c3-7ba40dfbdb83)


## Installation & Usage
### install

```sh
npm i -S random-weighted-pick
```

### usage

```ts
import { weightedPick, pickMany, createWeightedPicker } from 'random-weighted-pick'
// CommonJS
// const { weightedPick } = require('random-weighted-pick')
```

```ts
const options = [
  { id: 0, weight: 0.2, item: () => 'Lemon' },
  { id: 1, weight: 0.3, item: ['Grape', 'Orange', 'Apple'] },
  { id: 2, weight: 0.4, item: 'Mango' },
  { id: 3, weight: 0.1, item: 3 }
]

// weights will be normalized automatically
const result = weightedPick(options)
console.log(result) // { id: 2, item: 'Mango' }

// pick many without replacement
const many = pickMany(options, 2, { replacement: false })
console.log(many)

// create a fast picker using alias method
const picker = createWeightedPicker(options, { method: 'alias' })
picker.pick() // => { id, item }
```

### Options

All pick functions accept an optional configuration object:

```ts
type PickConfig = {
  normalize?: boolean // default true
  epsilon?: number    // default 1e-12
  rng?: () => number  // default uses crypto.getRandomValues when available
}
```

`pickMany` also accepts `{ replacement?: boolean }` and `createWeightedPicker` accepts `{ method?: 'cdf' | 'alias' }`.

## Development
### install
`npm install`

Dependency module install
### build

`npm run build`

Do some magic with ES6 to create ES5 code.

### test

`npm run test`

Run test with [Jest](https://facebook.github.io/jest/) + [Chai](http://chaijs.com)

### develop
`npm run dev` : Run develop server

You can see result in

http://localhost:8080

## List of available tasks

### clean

 `rm -f dist/*`

 Delete existing dist files

## License
```
MIT License

Copyright (c) 2016 KossHackaton OneTeam
```
