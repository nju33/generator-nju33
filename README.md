# Generator nju33

<img src="https://github.com/nju33/generator-nju33/blob/master/images/yeoman.png?raw=true" width=50 align=right>

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Generator for me.

## Install

```bash
npm i -g generator-nju33
```

## Generators

### `npm`

#### Env

- rollup (svelte|vue|babel[-preset-env])
- xo
- ava
- browser-sync

#### Format

- iife
- umd
- es

#### Usage

```bash
yo nju33:npm <name> <module-name>
```

#### Process

1. Copy a set of files
2. Install with `yarn`
3. Run `git init`

### `babel`

#### Common plugins

- babel-preset-env
- babel-plugin-transform-class-properties
- babel-plugin-transform-decorators-legacy
- babel-plugin-transform-object-rest-spread

#### Optional plugins

When typing `y`, install the following.

- babel-plugin-transform-runtime
- babel-plugin-external-helpers

If not, the following

- babel-plugin-add-module-exports

#### Usage

```bash
yo nju33:babel
? Compile further after converting with Babel? (Y/n): _
```

#### Process

1. Look for `package.json` and create `.babelrc` in the same directory or  edit already `.babelrc`
2. Install plugins with `yarn`

## License

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
