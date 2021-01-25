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
    it("errors if I specify an invalid view engine", (done) => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, generateInto: "server", viewEngine: "badInput" })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .catch((err) => {
          expect(err.message).toMatch("Invalid view engine");
          assert.noFile("server/src/app.js");
          done();
        });
    });

    it("errors if I specify an invalid testFramework", (done) => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, generateInto: "server", testFramework: "badInput" })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .catch((err) => {
          expect(err.message).toMatch("Invalid test framework");
          assert.noFile("server/src/app.js");
          done();
        });
    });
  });

  describe("happy path", () => {
    beforeAll((done) => {
      return helpers
        .run(generatorPath, { skipInstall: false })
        .withOptions({
          skipInstall: false,
          generateInto: "server",
          authentication: "none",
          dbClient: "pg",
          "client-app-path": "client",
        })
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

    it("creates a package.json", () => {
      assert.file("server/package.json");
    });

    it("includes the express, morgan, and body-parser in deps", () => {
      json = readPackageJson();
      expect(json.dependencies).toBeDefined();
      expect(json.dependencies.express).toBeDefined();
      expect(json.dependencies.morgan).toBeDefined();
    });

    it("creates an app.js file in src directory", () => {
      assert.file("server/src/app.js");
    });

    it("creates a public directory", () => {
      assert.file("server/public/.gitkeep");
    });

    it("installs peer dependencies", () => {
      expect(json.devDependencies["eslint-plugin-react"]).toBeDefined();
    });

    it("adds a start script", () => {
      json = readPackageJson();
      expect(json.scripts.start).toEqual("node src/app.js");
    });

    it("adds a clean script", () => {
      json = readPackageJson();
      expect(json.scripts.clean).toEqual("rm -rf ./public/dist");
    });

    it("specifies a node engine", () => {
      json = readPackageJson();
      expect(json.engines.node).toBeDefined();
    });

    describe("nodemon", () => {
      it("installs nodemon as a dev dependency", () => {
        expect(json.devDependencies.nodemon).toBeDefined();
      });

      it("adds a dev script with nodemon and clean script", () => {
        expect(json.scripts.dev).toBeDefined();
        expect(json.scripts.dev).toEqual("yarn run clean && nodemon src/app.js");
      });

      it("adds a dev:debug script", () => {
        expect(json.scripts["dev:debug"]).toBeDefined();
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

    describe("handlebars", () => {
      it("installs the handlebars middleware", () => {
        expect(json.dependencies["express-handlebars"]).toBeDefined();
      });

      it("adds the handlebars middleware snippet", () => {
        assert.fileContent("server/src/app.js", '"hbs"');
      });

      it("adds the require of handlebars middleware", () => {
        assert.fileContent("server/src/app.js", 'from "express-handlebars";');
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

      it("adds a layouts/client.hbs", () => {
        assert.file("server/views/layouts/client.hbs");
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
        assert.file("server/Procfile");
      });
    });

    describe("e2e", () => {
      it("creates an e2e env file", () => {
        assert.file("server/src/boot/environments/e2e.js");
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
        assert.fileContent("server/.nvmrc", process.version);
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
        assert.fileContent("server/src/middlewares/addExpressSession.js", "cookie-session");
      });

      it("creates a script for randomly generating a string", () => {
        assert.file("server/scripts/generate-secret.js");
      });

      it("adds a script in package.json for generating a secret", () => {
        expect(json.scripts["generate-secret"]).toBeDefined();
      });

      it("adds express-session as a dependency", () => {
        expect(json.dependencies["cookie-session"]).toBeDefined();
      });

      it("generates a secret and puts it in the .env file", () => {
        assert.file("server/.env");
        assert.fileContent("server/.env", "SESSION_SECRET");
      });
    });

    describe("client middlewares", () => {
      it("adds client middleware to app.js", () => {
        assert.file("server/src/middlewares/addClientMiddlewares.js");
        assert.fileContent(
          "server/src/middlewares/addMiddlewares.js",
          "import addClientMiddlewares"
        );
        assert.fileContent("server/src/middlewares/addMiddlewares.js", "addClientMiddlewares(");
      });
    });

    describe("pg database option", () => {
      it("installs pg as a dependency", () => {
        expect(json.dependencies.pg).toBeDefined();
      });
      it("configures a database url", () => {
        assert.fileContent("server/src/config.js", "databaseUrl:");
      });
      it("includes a getDatabaseUrl function", () => {
        assert.file("server/src/config/getDatabaseUrl.cjs");
      });
      it("adds db middleware to app.js", () => {
        assert.file("server/src/middlewares/addDbMiddleware.js");
        assert.fileContent("server/src/middlewares/addMiddlewares.js", "import addDbMiddleware");
        assert.fileContent("server/src/middlewares/addMiddlewares.js", "addDbMiddleware(");
      });
    });
  });

  describe("passport", () => {
    beforeAll((done) => {
      return helpers
        .run(generatorPath)
        .withOptions({
          skipInstall: false,
          authentication: "passport",
          dbClient: "objection",
          generateInto: "server",
        })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .then(() => {
          done();
        });
    });

    it("installs passport", () => {
      json = readPackageJson();
      expect(json.dependencies.passport).toBeDefined();
    });

    it("installs passport-local", () => {
      json = readPackageJson();
      expect(json.dependencies["passport-local"]).toBeDefined();
    });
    it("installs bcrypt", () => {
      json = readPackageJson();
      expect(json.dependencies.bcrypt).toBeDefined();
    });

    it("installs objection-unique", () => {
      json = readPackageJson();
      expect(json.dependencies["objection-unique"]).toBeDefined();
    });

    it("adds a passport strategy file", () => {
      assert.file("server/src/authentication/passportStrategy.js");
    });
    it("adds a deserializeUser file", () => {
      assert.file("server/src/authentication/deserializeUser.js");
    });
    it("adds a passport middleware file", () => {
      assert.file("server/src/middlewares/addPassport.js");
    });
    it("adds a user model", () => {
      assert.file("server/src/models/User.js");
    });

    it("adds the user migration", () => {
      assert.file("server/src/db/migrations/20210101210207_createUsers.cjs");
    });

    it("adds a user router", () => {
      assert.file("server/src/routes/api/v1/usersRouter.js");
    });
  });

  describe("objectionJS", () => {
    beforeAll((done) => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: false, dbClient: "objection", generateInto: "server" })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .then(() => {
          done();
        });
    });

    it("installs knex", () => {
      json = readPackageJson();
      expect(json.dependencies.knex).toBeDefined();
    });

    it("installs objectionJS", () => {
      json = readPackageJson();
      expect(json.dependencies.objection).toBeDefined();
    });

    it("installs pg", () => {
      json = readPackageJson();
      expect(json.dependencies.pg).toBeDefined();
    });

    it("creates a knexfile", () => {
      assert.file("server/knexfile.cjs");
    });
    it("creates a src/models/Model.js", () => {
      assert.file("server/src/models/Model.js");
    });

    it("creates a src/models/package.json", () => {
      assert.file("server/src/models/package.json");
    });

    it("creates a src/models/index.js", () => {
      assert.file("server/src/models/index.js");
    });

    it("creates a boot/model.cjs", () => {
      assert.file("server/src/boot/model.cjs");
    });
    it("creates a server/src/db/migration directory", () => {
      assert.file("server/src/db/migrations/migration.stub.cjs");
    });

    it("creates a server/test/utils/truncateModel.cjs", () => {
      assert.file("server/test/utils/truncateModel.cjs");
    });

    it("adds a migrate:latest script", () => {
      expect(json.scripts["migrate:latest"]).toBeDefined();
    });
    it("adds a migrate:rollback script", () => {
      expect(json.scripts["migrate:rollback"]).toBeDefined();
    });

    it("adds a migrate:make script", () => {
      expect(json.scripts["migrate:make"]).toBeDefined();
    });

    it("adds a db:test:migrate script", () => {
      expect(json.scripts["db:test:migrate"]).toBeDefined();
    });

    it("adds a db:e2e:migrate script", () => {
      expect(json.scripts["db:e2e:migrate"]).toBeDefined();
    });

    it("adds a console script", () => {
      expect(json.scripts.console).toBeDefined();
    });
  });

  describe("no view engine", () => {
    it("does insert a view engine", () => {
      return helpers
        .run(generatorPath)
        .withOptions({ skipInstall: true, viewEngine: "none", generateInto: "server" })
        .inTmpDir((dir) => {
          destinationRoot = dir;
        })
        .then(() => {
          assert.noFileContent("server/src/app.js", 'app.set("views")');
        });
    });
  });
});
