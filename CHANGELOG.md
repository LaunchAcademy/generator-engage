# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- `express-session` support [#18](https://github.com/LaunchAcademy/generator-engage/issues/18)
- react configuration and separate client namespace in the filesystem [#14](https://github.com/LaunchAcademy/generator-engage/issues/18)
- upgrade ESM so that CJS modules are no longer used [#34](https://github.com/LaunchAcademy/generator-engage/issues/34)
- `@types/jest` as a dev dependency

### Changed

- Runtime on ESM with Jest tests remaining with the babel transpiler. Yeoman constrains us to commonJS for the library itself ([#29](https://github.com/LaunchAcademy/generator-engage/issues/29))
- Create a `Dependency` abstraction to encapsulate both npm package and correlating version
- Consider `.cjs` files in babel-jest ([#45](https://github.com/LaunchAcademy/generator-engage/issues/45))
- Create a high level "app" generate that builds a workspace and is composed of `client` and `server`

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
