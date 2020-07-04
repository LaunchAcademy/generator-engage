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
  "file-loader": "^6.0.0",
  "css-loader": "^3.6.0",
  "mini-css-extract-plugin": "^0.9.0",
  "node-sass": "^4.14.1",
  "sass-loader": "^8.0.2",
  "style-loader": "^1.2.1",
};

const reactDevDependencies = {
  webpack: "~4.0",
  "webpack-cli": "~3.3.11",
  "webpack-dev-server": "~3.11",
};
class ClientGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    this.option("output-dir", {
      type: String,
      default: "dist",
      description: "relative path to webpack output dir",
    });
  }

  writeBase() {
    ["package.json", "webpack.config.js", "babel.config.js", "public/index.html"].forEach(
      (filePath) => {
        this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
          options: this.options,
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
