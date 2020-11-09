import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import fs from "fs";

const generatorPath = path.join(__dirname, "../generators/app");

describe("app test", () => {
  let destinationRoot;

  const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.join(destinationRoot, "package.json")));
  };

  describe("happy path", () => {
    beforeAll((done) => {
      return helpers
        .run(generatorPath, { skipInstall: false })
        .withOptions({ skipInstall: false })
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

    it("has a package.json", () => {
      assert.file("package.json");
    });

    it("has a client directory", () => {
      expect(assert.file("client"));
    });

    it("has a server directory", () => {
      expect(assert.file("server"));
    });

    it("defines a server workspace", () => {
      const { workspaces } = readPackageJson();
      expect(workspaces).toBeDefined();
      expect(workspaces).toContain("server");
    });

    it("defines a server workspace", () => {
      const { workspaces } = readPackageJson();
      expect(workspaces).toBeDefined();
      expect(workspaces).toContain("client");
    });

    it("defines a dev:debug script", () => {
      const { scripts } = readPackageJson();
      expect(scripts["dev:debug"]).toBeDefined();
    });
  });
});
