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
  });
});
