# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- upgraded HTML webpack plugin to 5.2.0[#132](https://github.com/LaunchAcademy/generator-engage/issues/132)
- client now users `config.nodeEnv` instead of `config.env`[#133](https://github.com/LaunchAcademy/generator-engage/issues/133)

## [0.3.0](https://github.com/LaunchAcademy/generator-engage/releases/tag/v0.3.0)

## Added

- added console / repl when objection is supported [#31](https://github.com/LaunchAcademy/generator-engage/issues/40)
- added `dev:debug` convenience script in server [#72](https://github.com/LaunchAcademy/generator-engage/issues/72)
- added `--help` documentation for the `app` generator [#71](https://github.com/LaunchAcademy/generator-engage/issues/71)
- include a global `main.scss` for global styling [#73](https://github.com/LaunchAcademy/generator-engage/issues/73)
- added Favicon to avoid unnecessary console errors [#82](https://github.com/LaunchAcademy/generator-engage/issues/82)
- support foundation on the front-end [#74](https://github.com/LaunchAcademy/generator-engage/issues/73)
- support running webpack bidirectionally, handle for an allow list of client-side routes [#68](https://github.com/LaunchAcademy/generator-engage/issues/68)
- specify node engine directives in all package.jsons on the basis of the generator runtime
- generate vscode workspace settings file for color differentiation [#89](https://github.com/LaunchAcademy/generator-engage/issues/89)
- generate e2e folder with cypress [#28](https://github.com/LaunchAcademy/generator-engage/issues/28)
- create a `gitignore` in client directory
- update client `outputdir` to consider a standalone client installation
- set `window.title` in vscode settings [#109](https://github.com/LaunchAcademy/generator-engage/issues/109)
- provide authentication logic with passport, include e2e tests [#64](https://github.com/LaunchAcademy/generator-engage/issues/64)

### Changed

- use `cookie-session` instead of `express-session` [#66](https://github.com/LaunchAcademy/generator-engage/issues/66)
- changed options to adhere to camelCase conventions consistently
- updated `.gitignore` template on server side to avoid `.npmignore` renaming bug [#78] (https://github.com/LaunchAcademy/generator-engage/issues/78)
- changed file structure to be consistent with patterns in instruction: server's `app.js` within `src` directory and now creates/uses `__dirname` variable, React entrypoint in `main.js` (from `index.js`) [#80](https://github.com/LaunchAcademy/generator-engage/issues/80) [#84](https://github.com/LaunchAcademy/generator-engage/issues/84)
- updated React to use `.js` files for JSX code
- development boot and middleware configuration now takes advantage of top-level await, allowing `dotenv` and `errorhandler` to be true `devDependencies`


## [0.2.1](https://github.com/LaunchAcademy/generator-engage/releases/tag/v0.2.1)

### Added

- `.eslintrc.json` and `.prettierrc` files for client [#40](https://github.com/LaunchAcademy/generator-engage/issues/40)



## [0.2.0](https://github.com/LaunchAcademy/generator-engage/releases/tag/v0.2.0)

### Added

- `express-session` support [#18](https://github.com/LaunchAcademy/generator-engage/issues/18)
- react configuration and separate client namespace in the filesystem [#14](https://github.com/LaunchAcademy/generator-engage/issues/18)
- upgrade ESM so that CJS modules are no longer used [#34](https://github.com/LaunchAcademy/generator-engage/issues/34)
- `@types/jest` as a dev dependency
- `pg` db-client support and middleware ([#57](https://github.com/LaunchAcademy/generator-engage/issues/57))
- Ability to proxy from client to server ([#51](https://github.com/LaunchAcademy/generator-engage/issues/51))
- CSS, SASS, File loading support on the client ([#52](https://github.com/LaunchAcademy/generator-engage/issues/52))
- Add a handlebars template server side for rendering client application
- `objection` db-client support ([#49](https://github.com/LaunchAcademy/generator-engage/issues/49))

### Changed

- Runtime on ESM with Jest tests remaining with the babel transpiler. Yeoman constrains us to commonJS for the library itself ([#29](https://github.com/LaunchAcademy/generator-engage/issues/29))
- Create a `Dependency` abstraction to encapsulate both npm package and correlating version
- Consider `.cjs` files in babel-jest ([#45](https://github.com/LaunchAcademy/generator-engage/issues/45))
- Create a high level "app" generate that builds a workspace and is composed of `client` and `server`
- Updated webpack to 4.43

### Removed

- Sequelize configuration is no longer an option ([#48](https://github.com/LaunchAcademy/generator-engage/issues/48))

## [0.1.2](https://github.com/LaunchAcademy/generator-engage/releases/tag/v0.1.2)

### Added

- Dotenv support for dev and test environments
- Heroku Procfile
- Initial sequelize support - generate a config, models folder, migrations folder and seeds folder
- NormalizeCSS along with some modernized opinions
- Handlebars support
- Eslint, Prettier, and Gitignore files / configuration
- Nodemon support
- Basic express generation

### Fixed

- Addressed path issue with public directory ([#26](https://github.com/LaunchAcademy/generator-engage/issues/26))
