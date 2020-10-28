import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import fs from "fs";

const generatorPath = path.join(__dirname, "../generators/client");

describe("generator-engage:client", () => {
  let destinationRoot;
  let json;

  const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.join(destinationRoot, "client/package.json")));
  };

  describe("happy path", () => {
    beforeAll((done) => {
      return helpers
        .run(generatorPath, { skipInstall: false })
        .withOptions({ skipInstall: false, generateInto: "client" })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .catch((err) => {
          throw err;
        })
        .then(() => {
          done();
        });
    });

    it("installs react as a dependency", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies.react).toBeDefined();
    });

    it("installs react-dom as a dependency", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies["react-dom"]).toBeDefined();
    });

    it("installs @babel/core as a dependency", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies["@babel/core"]).toBeDefined();
    });

    it("installs redbox-react", () => {
      json = readPackageJson();
      expect(json.dependencies["redbox-react"]).toBeDefined();
    });

    it("installs prop-types", () => {
      json = readPackageJson();
      expect(json.dependencies["prop-types"]).toBeDefined();
    });

    it("installs webpack-cli as a dev dependency", () => {
      json = readPackageJson();
      expect(json.devDependencies["webpack-cli"]).toBeDefined();
    });

    it("creates a public/index.html", () => {
      assert.file("client/public/index.html");
    });

    it("creates a webpack.config.js", () => {
      assert.file("client/webpack.config.js");
    });

    it("creates a babel.config.js", () => {
      assert.file("client/babel.config.js");
    });

    it("installs node-sass", () => {
      expect(json.dependencies["node-sass"]).toBeDefined();
    });

    it("installs css loader", () => {
      expect(json.dependencies["css-loader"]).toBeDefined();
    });

    it("installs style-loader", () => {
      expect(json.dependencies["style-loader"]).toBeDefined();
    });

    it("installs sass-loader", () => {
      expect(json.dependencies["sass-loader"]).toBeDefined();
    });

    it("installs file-loader", () => {
      expect(json.dependencies["file-loader"]).toBeDefined();
    });

    it("installs mini-css-extract-plugin", () => {
      expect(json.dependencies["mini-css-extract-plugin"]).toBeDefined();
    });

    it("places an src/assets/scss/main.scss file", () => {
      assert.file("client/src/assets/scss/main.scss");
    });

    it("creates a dev script", () => {
      expect(json.scripts.dev).toBeDefined();
    });

    it("creates a build script", () => {
      expect(json.scripts.build).toBeDefined();
    });

    it("creates an eslintrc file", () => {
      assert.file("client/.eslintrc.json");
    });

    it("creates a prettierrc", () => {
      assert.file("client/.prettierrc");
    });
  });
});
