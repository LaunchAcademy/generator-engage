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
    it("errors if I specify an invalid view engine", done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withOptions({ skipInstall: true, "view-engine": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid view engine");
          assert.noFile("app.js");
          done();
        });
    });

    it("errors if I specify an invalid test-framework", done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withOptions({ skipInstall: true, "test-framework": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid test framework");
          assert.noFile("app.js");
          done();
        });
    });

    it("errors if I specify an invalid test-framework", done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withOptions({ skipInstall: true, "db-client": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid database client");
          assert.noFile("app.js");
          done();
        });
    });
  });

  describe("happy path", () => {
    beforeAll(done => {
      return helpers
        .run(path.join(__dirname, "../generators/app"), { skipInstall: false })
        .withOptions({ skipInstall: false })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          throw err;
        })
        .then(() => {
          done();
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

    it("installs peer dependencies", () => {
      expect(json.devDependencies["eslint-plugin-react"]).toBeDefined();
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

  describe("handlebars", () => {
    it("installs the handlebars middleware", () => {
      expect(json.dependencies["express-handlebars"]).toBeDefined();
    });

    it("adds the handlebars middleware snippet", () => {
      assert.fileContent("app.js", '"hbs"');
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

  describe("jest", () => {
    it("adds jest as a devDependency", () => {
      expect(json.devDependencies.jest).toBeDefined();
    });

    it("adds a jest.config.js", () => {
      assert.file("jest.config.js");
    });

    it("adds scripts for testing and CI", () => {
      expect(json.scripts.test).toEqual("jest");
      expect(json.scripts.ci).toEqual("jest --coverage");
    });
  });

  describe("sequelize", () => {
    it("adds a sequelizerrc", () => {
      assert.file(".sequelizerc");
    });

    it("adds a database.js config file", () => {
      assert.file("config/database.js");
    });

    it("adds a src/db/migrations folder", () => {
      const filePath = path.join(destinationRoot, "src/db/migrations");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("adds a src/db/seeders file", () => {
      const filePath = path.join(destinationRoot, "src/db/seeders");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("adds pg as a dependency", () => {
      expect(json.dependencies.pg).toBeDefined();
    });

    it("adds sequelize as a dependency", () => {
      expect(json.dependencies.sequelize).toBeDefined();
    });

    it("adds sequelize-cli as a dev dependency", () => {
      expect(json.devDependencies["sequelize-cli"]).toBeDefined();
    });
  });

  describe("procfile", () => {
    it("creates a procfile", () => {
      assert.file("Procfile");
    });
  });

  describe("dotenv", () => {
    it("adds dotenv as a dev dependency", () => {
      expect(json.devDependencies.dotenv).toBeDefined();
    });

    it("creates a src/boot/index.js", () => {
      assert.file("src/boot/index.js");
    });

    it("creates a src/boot/development.js", () => {
      assert.file("src/boot/environments/development.js");
    });

    it("creates a src/boot/test.js", () => {
      assert.file("src/boot/environments/test.js");
    });

    it("creates a test/testHelper.js", () => {
      assert.file("test/testHelper.js");
    });
  });

  describe("nvmrc", () => {
    it("creates an nvmrc with the relevant version", () => {
      assert.fileContent(".nvmrc", process.version);
    });
  });

  describe("error handler", () => {
    it("includes errorhandler as a devDependency", () => {
      expect(json.devDependencies.errorhandler).toBeDefined();
    });

    it("is found in the development middlewares", () => {
      assert.fileContent(
        "src/middlewares/environments/addDevelopmentMiddlewares.js",
        "errorHandler"
      );
    });

    it("creates an errorHandler file", () => {
      assert.file("src/middlewares/errorHandler.js");
    });
  });

  describe("no view engine", () => {
    it("does insert a view engine", () => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withOptions({ skipInstall: true, "view-engine": "none" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .then(() => {
          assert.noFileContent("app.js", 'app.set("views")');
        });
    });
  });
});