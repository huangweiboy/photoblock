# PhotoBlock ALPHA Release

PhotoBlock provides user-friendly visual account and login capability to blockchain dapps and websites. For more information, visit the [TryCrypto Website](https://www.trycrypto.com/photoblock), or to see PhotoBlock in action, check out the [PhotoBlock Demo](https://www.photoblock.org).

## Getting started

Follow these steps to get started developing:

* `npm install`
* `npm run build:sprite`
* `npm run dev` to transpile both the lib and docs folder in watch mode and serve the docs page for you.
* Go to http://127.0.0.1:8000 to see the demo in action. Whenever you change the code in either src/lib or src/docs, the page will automatically update.

## How it is structured

The source code has two separate parts – the library and the documentation (demo) page. Both are written in ES6, and therefore have to be transpiled by Babel but in different ways.

### Component library transpilation

The library source code, which is located in `src/lib`, is transpiled with Babel but is _not_ bundled with Webpack. (This is because when you use the library for your application you bundle your entire codebase, which includes this library.)

### Demo app transpilation

The demo app source code lives inside the `src/docs` folder. It is transpiled, bundled and minified by Webpack and Babel into the `docs` folder in the root directory (by running `npm run docs:prod`). This is a completely normal HTML+JS+CSS app with minimal configuration that imports the component library. (The reason that the folder doesn't have a logical name like `demo` is that GitHub Pages requires it to be called `docs`.)


