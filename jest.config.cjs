module.exports = {
  testTimeout: 120000,
  testPathIgnorePatterns: ["<rootDir>/generators/app/templates"],
  moduleFileExtensions: ["js", "json", "mjs", "node"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};
