const Generator = require("yeoman-generator");
const path = require("path");
const Dependency = require("./Dependency");

/**
 * Abstract class that all engage generators should inherit from
 *
 * @class EngageGenerator
 * @extends {Generator}
 */
class EngageGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option("generateInto", {
      type: String,
      required: false,
      defaults: "",
      desc: "Relocate the location of the generated files."
    });

    this.dependencies = [];
    this.devDependencies = [];
  }

  generatedPath(...destPathSegments) {
    const pathSegments = [
      this.destinationPath(),
      this.options.generateInto,
      ...destPathSegments
    ].filter(segment => !!segment && segment !== "");
    return path.join(...pathSegments);
  }

  _install() {
    const stringifiedDependencies = this.dependencies.map(d => d.toString());
    const stringifiedDevDependencies = this.devDependencies.map(d => d.toString());
    this.yarnInstall(stringifiedDevDependencies, { dev: true }, { cwd: this.generatedPath() });
    this.yarnInstall(stringifiedDependencies, { save: true, cwd: this.generatedPath() });
  }

  _addDependencies(packages, version = null, { dev = false } = {}) {
    const packageList = Array.isArray(packages) ? packages : [packages];
    const dependencies = packageList.map(pkg => {
      return new Dependency(pkg, version, { dev });
    });
    if (dev) {
      this.devDependencies = [...this.devDependencies, ...dependencies];
    } else {
      this.dependencies = [...this.dependencies, ...dependencies];
    }
  }

  _copyTemplate(filePath, options = {}) {
    return this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), options);
  }

  _modifyJson(jsonPath, jsonModifier) {
    const json = this.fs.readJSON(this.generatedPath(jsonPath));
    jsonModifier(json);
    this.fs.writeJSON(this.generatedPath(jsonPath), json);
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
