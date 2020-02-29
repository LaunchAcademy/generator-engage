const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const fs = require("fs");

describe("generator-engage:app", () => {
  let destinationRoot;
  let json;

  const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.join(destinationRoot, "package.json")));
  };

  describe("running the generator improperly", () => {
    it("errors if I specify an invalid view engine", () => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withOptions({ skipInstall: true, "view-engine": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid view engine");
          assert.noFile("app.js");
        });
    });
  });

  describe("happy path", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"), { skipInstall: false })
        .withOptions({ skipInstall: false })
        .inTmpDir(dir => {
          destinationRoot = dir;
        });
    });

    it("creates a package.json", () => {
      assert.file("package.json");
    });

    it("includes the express, morgan, and body-parser in deps", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies.express).toBeDefined();
      expect(json.dependencies.morgan).toBeDefined();
    });

    it("creates an app.js file", () => {
      assert.file("app.js");
    });

    it("creates a public directory", () => {
      assert.file("public/.gitkeep");
    });

    it("adds a start script", () => {
      json = readPackageJson();
      expect(json.scripts.start).toEqual("node app.js");
    });

    describe("nodemon", () => {
      it("installs nodemon as a dev dependency", () => {
        expect(json.devDependencies.nodemon).toBeDefined();
      });

      it("adds a dev script with nodemon", () => {
        expect(json.scripts.dev).toBeDefined();
        expect(json.scripts.dev).toEqual("nodemon app.js");
      });
    });

    describe("linters", () => {
      it("uses airbnb", () => {
        expect(json.devDependencies["eslint-config-airbnb"]).toBeDefined();
      });

      it("installs peerdependencies", () => {
        expect(json.devDependencies["eslint-plugin-react"]).toBeDefined();
      });

      it("creates an .eslintrc", () => {
        assert.file(".eslintrc");
      });

      it("creates a .prettierrc", () => {
        assert.file(".prettierrc");
      });

      it("creates a .gitignore", () => {
        assert.file(".gitignore");
      });
    });
  });
});
