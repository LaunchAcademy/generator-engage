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
  "file-loader": "^6.2.0",
  "html-webpack-plugin": "^4.5.0",
  "css-loader": "^5.0.0",
  "mini-css-extract-plugin": "^0.9.0",
  "node-sass": "^4.14.1",
  "sass-loader": "^8.0.2",
  "style-loader": "^1.2.1",
  webpack: "^5.3.2",
  "webpack-cli": "^4.1.0",
  "webpack-hot-middleware": "^2.25.0",
};

const reactDevDependencies = {
  "webpack-dev-server": "~3.11",
};
class ClientGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    this.option("outputDir", {
      type: String,
      default: "dist",
      description: "relative path to webpack output dir",
    });
  }

  writeBase() {
    [
      "package.json",
      "webpack.config.js",
      "babel.config.js",
      "public/index.html",
      "public/index.template.html",
      "public/favicon.ico",
      ".prettierrc",
    ].forEach((filePath) => {
      this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
        options: this.options,
        name: path.basename(this.generatedPath("../")),
      });
    });

    this.fs.copy(
      this.templatePath(".eslintrc.json.template"),
      this.generatedPath(".eslintrc.json")
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

    ["src/components/App.js", "src/main.js", "src/config.js", "src/assets/scss/main.scss"].forEach(
      (filePath) => {
        this.fs.copy(this.templatePath(filePath), this.generatedPath(filePath));
      }
    );
  }
}

module.exports = ClientGenerator;
