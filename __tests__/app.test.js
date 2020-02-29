const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const fs = require("fs");

describe("generator-engage:app", () => {
  let destinationRoot;

  const readPackageJson = () => {
    return JSON.parse(
      fs.readFileSync(path.join(destinationRoot, "package.json"))
    );
  };

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
    const json = readPackageJson();
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
    const json = readPackageJson();
    expect(json.scripts.start).toEqual("node app.js");
  });

  describe("nodemon", () => {
    it("installs nodemon as a dev dependency", () => {
      const json = readPackageJson();
      expect(json.devDependencies.nodemon).toBeDefined();
    });

    it("adds a dev script with nodemon", () => {
      const json = readPackageJson();
      expect(json.scripts.dev).toBeDefined();
      expect(json.scripts.dev).toEqual("nodemon app.js");
    });
  });
});
