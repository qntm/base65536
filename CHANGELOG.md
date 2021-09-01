# CHANGELOG

## 4.x.x

`base65536` now ships as JavaScript ("ES6") modules, not CommonJS modules. The package has `"type": "module"`. Additionally a separate IIFE for browser use is no longer distributed.

## 3.x.x

`encode` and `decode` now use `Uint8Arrays`, not `ArrayBuffer`s. The options `ignoreGarbage` and `wrap` have been scrapped.

## 2.x.x

`encode` and `decode` now operate on environment-agnostic `ArrayBuffer`s instead of Node.js-specific `Buffer`s.

## 1.x.x

No breaking changes; in this version, the code point repertoire was deemed final.

## 0.0.x

Prototype release.
