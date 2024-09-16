
<p align="center">
  <img width="460" height="300" src="./favicon.svg">
</p>

<br />

<h1 align="center"> Jelly SQL - JavaScript DOM Query Selector </h1>
<h2 align="center"> *** Work In Progress *** </h2>

# 

## About

Query the DOM in JavaScript with a familiar SQL syntax. Generates a CSS query selector that will in turn call the `document.querySelectorAll()`. Maybe a little magic sprinkle of dynamic functions to extend the capability of generic DOM query selectors.

## Installation

> TODO:
>  - CDN link
>  - Basic JS library usage example


Please see [Local Development](#Local-Development) for working with the source.

## Documentation

> TODO

## Features

> TODO

### TODO

- ~~Extend attribute substring selectors~~
- ~~Implement `:not()`~~
- ~~Force tag selectors to front of query~~
- ~~Resolve selectors duplicating with multiple un-grouped `OR` operators~~
- (***Active***)Implement combinators, ex. ` `, `>`, `+`, `~`
- (***Next***)Implement pseudo selectors
- Improve type checking & syntax errors
- ~~Unit testing~~
- Support escaping characters?

## Local Development

> `npm run-script <keyword>`

- `dev` - starts dev server
- `build` - generates the following bundles: ESM (`.js`) and IIFE (`.iife.js`). The name of bundle is automatically taken from `package.json` name property
- `test` - starts vitest and runs all tests
- `test:watch` - starts vitest and runs all tests, but watch for changes & rerun when changes detected
- `test:coverage` - starts vitest and run all tests with code coverage report
- `lint:scripts` - lint `.ts` files with eslint
- `lint:styles` - lint `.css` and `.scss` files with stylelint
- `format:scripts` - format `.ts`, `.html` and `.json` files with prettier
- `format:styles` - format `.cs` and `.scss` files with stylelint
- `format` - format all with prettier and stylelint
- `prepare` - script for setting up husky pre-commit hook
- `uninstall-husky` - script for removing husky from repository

## Acknowledgement

- Get things going: [kbysiec/vite-vanilla-ts-lib](https://github.com/kbysiec/vite-vanilla-ts-lib-starter)

## License

Source code is licensed under [MIT](LICENSE)