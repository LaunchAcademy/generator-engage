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

    it("installs peer dependencies", () => {
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

  describe("handlebars", () => {
    it("installs the handlebars middleware", () => {
      expect(json.dependencies["express-handlebars"]).toBeDefined();
    });

    it("adds the handlebars middleware snippet", () => {
      assert.fileContent("app.js", 'app.engine("hbs"');
    });

    it("adds the require of handlebars middleware", () => {
      assert.fileContent("app.js", 'require("express-handlebars");');
    });

    it("adds a default layout", () => {
      assert.file("views/layouts/default.hbs");
    });

    it("adds normalize css", () => {
      assert.file("public/css/vendor/normalize.min.css");
    });

    it("adds a main.css", () => {
      assert.file("public/css/main.css");
    });
  });
});
