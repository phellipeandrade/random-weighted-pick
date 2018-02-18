# npm-webpack-boilerplate
Boilerplate for npm/node module. Write with webpack & ES6

## How to get started
1. Install node and npm.
2. Clone this repo: git clone https://github.com/jeffgukang/npm-webpack-boilerplate.git YOUR-MODULE-NAME
3. Change project name and basic setting through `npm init`.
4. Install dependencies: `npm install`.
5. Make your own module.

## Commands
### install
`npm install`

Dependency module install
### build

`npm run build`

Do some magic with ES6 to create ES5 code.

### test

`npm run test`

Run test with [karma](https://karma-runner.github.io) + [jasmine](http://jasmine.github.io/2.5/introduction.html)

### develop
`npm run dev` : Run develop server

You can see result in

* OS X : http://0.0.0.0:8080,

* Windows : http://localhost:8080

## List of available tasks

### clean

 `rm -f dist/*`

 Delete existing dist files

## Description `package.json`

When you create an extension module to the node it can be deployed as a central repository via npm. `package.json` files were created characters contains information module for deployment, some applications written in the node can be managed using the `package.json` file. If not necessarily to be distributed in the form of expansion modules when you develop applications using `package.json` file is convenient because it allows dependency management for the expansion modules.

`package.json` file is basically faithful to follow the specification of which is CommonJS file in JSON format. Also directly create or may be automatically generated via npm init command. And information on the extension used for the application may automatically add the information to the module through the `npm install -save`.

## License
```
MIT License

Copyright (c) 2016 KossHackaton OneTeam
```
