import helpers from "yeoman-test";
import assert from "yeoman-assert";

import path from "path";

const generatorPath = path.join(__dirname, "../generators/e2e");
describe("e2e", () => {
  describe("happy path", () => {
    // let destinationRoot;

    beforeAll((done) => {
      return helpers
        .run(generatorPath, { skipInstall: false })
        .withOptions({ skipInstall: false, generateInto: "e2e" })
        .inTmpDir(() => {
          // destinationRoot = dir;
        })
        .catch((err) => {
          throw err;
        })
        .then(() => {
          done();
        });
    });

    it("creates a package.json", () => {
      assert.file("e2e/package.json");
    });

    it("creates a gitignore", () => {
      assert.file("e2e/.gitignore");
    });

    it("creates a prettierrc file", () => {
      assert.file("e2e/.prettierrc");
    });

    it("creates a cypress.json file", () => {
      assert.file("e2e/cypress.json");
    });

    it("creates a settings.json", () => {
      assert.file("e2e/.vscode/settings.json");
    });

    it("creates hello.js", () => {
      assert.file("e2e/cypress/integration/hello.js");
    });
  });
});
