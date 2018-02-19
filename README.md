# random-weighted-pick
A lightweight utility that allows you to easily choose a random item from a weighted list of items, with a probability dependent on their weight.

this module has no external dependencies and is licensed under the MIT License.

![](http://img.badgesize.io/https://unpkg.com/random-weighted-pick@latest/lib/index.js)

## Installation & Usage
### install

```sh
npm i -S random-weighted-pick
```

### usage

```js
import weightedPick from 'random-weighted-pick'
// OR
var weightedPick = require('random-weighted-pick');
```

```js

const options = [
    { id: 0, weight: 0.2, item: () => console.log('Lemon') },
    { id: 1, weight: 0.3, item: ['Grape', 'Orange', 'Apple'] },
    { id: 2, weight: 0.4, item: 'Mango' },
    { id: 3, weight: 0.1, item: 3 }
]
// Sum of 'weights' should be equal 1.

const result = weightedPick(options)

console.log(result) // { id: 2, item: 'Mango' }
```
[🔄 **Run this example on Codepen**](https://codepen.io/phellipeandrade/pen/NyyNrX)

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

* OS X : http://0.0.0.0:8080,

* Windows : http://localhost:8080

## List of available tasks

### clean

 `rm -f dist/*`

 Delete existing dist files

## License
```
MIT License

Copyright (c) 2016 KossHackaton OneTeam
```
