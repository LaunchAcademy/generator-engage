module.exports = {
  coverageDirectory: "coverage",
  setupFiles: ["./test/testHelper.js"],
  testPathIgnorePatterns: ["<rootDir>/src/boot/environments/test.js"],
  moduleFileExtensions: ["js", "json", "mjs", "node"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};
