# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/fatfisz/babel-plugin-module-resolverino/compare/v0.0.1...v1.0.0) (2017-04-01)


### Bug Fixes

* Fix double plugin bug ([#3](https://github.com/fatfisz/babel-plugin-module-resolverino/issues/3)) ([944a002](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/944a002))
* Use CWD for the glob patterns ([#4](https://github.com/fatfisz/babel-plugin-module-resolverino/issues/4)) ([1fcd018](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/1fcd018))


### Features

* Process alias and regexps together ([#5](https://github.com/fatfisz/babel-plugin-module-resolverino/issues/5)) ([9dfd7b8](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/9dfd7b8))
* Refactor node matching ([#2](https://github.com/fatfisz/babel-plugin-module-resolverino/issues/2)) ([554fc97](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/554fc97))
* Support a string as the root ([2ba5eaf](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/2ba5eaf))
* Use rollup for the build ([#6](https://github.com/fatfisz/babel-plugin-module-resolverino/issues/6)) ([b80890f](https://github.com/fatfisz/babel-plugin-module-resolverino/commit/b80890f))


### BREAKING CHANGES

* "npm:" support is dropped.
* package-like aliases are additionally resolved using root and cwd.
* relative aliases are left as-is to be consistent with how `getRealPath` treats relative paths.



<a name="0.0.1"></a>
## 0.0.1 (2017-04-01)


Initial release
