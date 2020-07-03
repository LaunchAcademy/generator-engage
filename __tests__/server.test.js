import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import fs from "fs";

const generatorPath = path.join(__dirname, "../generators/server");

describe("generator-engage:server", () => {
  let destinationRoot;
  let json;

  const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.join(destinationRoot, "server/package.json")));
  };

  describe("running the generator improperly", () => {
    it("errors if I specify an invalid view engine", done => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, "view-engine": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid view engine");
          assert.noFile("server/app.js");
          done();
        });
    });

    it("errors if I specify an invalid test-framework", done => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, "test-framework": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid test framework");
          assert.noFile("server/app.js");
          done();
        });
    });

    it.todo("errors if I specify an invalid test-framework", done => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, "db-client": "badInput" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .catch(err => {
          expect(err.message).toMatch("Invalid database client");
          assert.noFile("server/app.js");
          done();
        });
    });
  });

  describe("happy path", () => {
    beforeAll(done => {
      return helpers
        .run(generatorPath, { skipInstall: false })
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
      assert.file("server/package.json");
    });

    it("includes the express, morgan, and body-parser in deps", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies.express).toBeDefined();
      expect(json.dependencies.morgan).toBeDefined();
    });

    it("creates an app.js file", () => {
      assert.file("server/app.js");
    });

    it("creates a public directory", () => {
      assert.file("server/public/.gitkeep");
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
        assert.file(".eslintrc.cjs");
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
      assert.fileContent("server/app.js", '"hbs"');
    });

    it("adds the require of handlebars middleware", () => {
      assert.fileContent("server/app.js", 'from "express-handlebars";');
    });

    it("adds a default layout", () => {
      assert.file("server/views/layouts/default.hbs");
    });

    it("adds normalize css", () => {
      assert.file("server/public/css/vendor/normalize.min.css");
    });

    it("adds a main.css", () => {
      assert.file("server/public/css/main.css");
    });
  });

  describe("jest", () => {
    it("adds jest as a devDependency", () => {
      expect(json.devDependencies.jest).toBeDefined();
    });

    it("adds @types/jest as a devDependency", () => {
      expect(json.devDependencies["@types/jest"]).toBeDefined();
    });

    it("adds a jest.config.cjs", () => {
      assert.file("server/jest.config.cjs");
    });

    it("adds a babel.config.cjs", () => {
      assert.file("server/babel.config.cjs");
    });

    it("adds scripts for testing and CI", () => {
      expect(json.scripts.test).toEqual("jest");
      expect(json.scripts.ci).toEqual("jest --coverage");
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

    it("creates a src/boot.js", () => {
      assert.file("server/src/boot.js");
    });

    it("creates a src/boot/development.js", () => {
      assert.file("server/src/boot/environments/development.js");
    });

    it("creates a src/boot/test.js", () => {
      assert.file("server/src/boot/environments/test.js");
    });

    it("creates a test/testHelper.js", () => {
      assert.file("server/test/testHelper.js");
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
        "server/src/middlewares/environments/addDevelopmentMiddlewares.js",
        "errorHandler"
      );
    });

    it("creates an errorHandler file", () => {
      assert.file("server/src/middlewares/errorHandler.js");
    });
  });

  describe("express-session", () => {
    it("introduces the express-session middleware", () => {
      assert.fileContent("server/src/middlewares/addExpressSession.js", "express-session");
    });

    it("creates a script for randomly generating a string", () => {
      assert.file("server/scripts/generate-secret.js");
    });

    it("adds a script in package.json for generating a secret", () => {
      expect(json.scripts["generate-secret"]).toBeDefined();
    });

    it("adds express-session as a dependency", () => {
      expect(json.dependencies["express-session"]).toBeDefined();
    });

    it("generates a secret and puts it in the .env file", () => {
      assert.file("server/.env");
      assert.fileContent("server/.env", "SESSION_SECRET");
    });
  });

  describe("no view engine", () => {
    it("does insert a view engine", () => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, "view-engine": "none" })
        .inTmpDir(dir => {
          destinationRoot = dir;
        })
        .then(() => {
          assert.noFileContent("server/app.js", 'app.set("views")');
        });
    });
  });
});
