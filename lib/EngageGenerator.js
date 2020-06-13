const Generator = require("yeoman-generator");

/**
 * Abstract class that all engage generators should inherit from
 *
 * @class EngageGenerator
 * @extends {Generator}
 */
class EngageGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.dependencies = [];
    this.devDependencies = [];
  }

  install() {
    this.yarnInstall(this.devDependencies, { dev: true }, { cwd: this.destinationPath() });
    this.yarnInstall(this.dependencies, { save: true, cwd: this.destinationPath() });
  }

  _addDependencies(packages, { dev = false } = {}) {
    const packageList = Array.isArray(packages) ? packages : [packages];
    if (dev) {
      this.devDependencies = [...this.devDependencies, ...packageList];
    } else {
      this.dependencies = [...this.dependencies, ...packageList];
    }
  }

  _copyTemplate(filePath, options = {}) {
    return this.fs.copyTpl(this.templatePath(filePath), this.destinationPath(filePath), options);
  }

  _modifyJson(jsonPath, jsonModifier) {
    const json = this.fs.readJSON(this.destinationPath(jsonPath));
    jsonModifier(json);
    this.fs.writeJSON(this.destinationPath(jsonPath), json);
  }

  _validateWhitelistedOption(optionName, validValues, humanName) {
    if (this.options[optionName] && !validValues.includes(this.options[optionName])) {
      const errorMessage = `Invalid ${humanName} supplied. Valid options are: ${validValues.join(
        ","
      )}`;
      this.errors.push(errorMessage);
    }
  }
}

module.exports = EngageGenerator;
