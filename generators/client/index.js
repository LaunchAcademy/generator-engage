const path = require("path");
const EngageGenerator = require("../../lib/EngageGenerator");

const reactDependencies = {
  "@babel/core": "7.10.2",
  "@babel/plugin-proposal-class-properties": "^7.0.0",
  "@babel/plugin-proposal-object-rest-spread": "^7.0.0",
  "@babel/plugin-syntax-dynamic-import": "^7.0.0",
  "@babel/plugin-transform-destructuring": "^7.6.0",
  "@babel/plugin-transform-regenerator": "^7.4.5",
  "@babel/plugin-transform-runtime": "^7.5.5",
  "@babel/preset-env": "^7.5.5",
  "@babel/preset-react": "^7.0.0",
  "@babel/runtime": "^7.6.2",
  "babel-loader": "~8.1",
  "prop-types": "~15.7",
  "redbox-react": "~1.6",
  react: "~16.13",
  "react-dom": "~16.13",
  "react-hot-loader": "^4.12.21",
  "react-router-dom": "~5.2",
};

const reactDevDependencies = {
  webpack: "~4.0",
  "webpack-cli": "~3.3.11",
  "webpack-dev-server": "~3.11",
};
class ClientGenerator extends EngageGenerator {
  writeBase() {
    ["package.json", "webpack.config.js", "babel.config.js", "public/index.html"].forEach(
      (filePath) => {
        this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
          name: path.basename(this.generatedPath("../")),
        });
      }
    );
  }

  install() {
    this._install();
  }

  react() {
    Object.keys(reactDependencies).forEach((dep) => {
      this._addDependencies(dep, reactDependencies[dep]);
    });

    Object.keys(reactDevDependencies).forEach((dep) => {
      this._addDependencies(dep, reactDevDependencies[dep], { dev: true });
    });

    ["src/components/App.jsx", "src/index.js", "src/config.js"].forEach((filePath) => {
      this.fs.copy(this.templatePath(filePath), this.generatedPath(filePath));
    });
  }
}

module.exports = ClientGenerator;
