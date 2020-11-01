const semver = require("semver");

const getNodeVersion = () => {
  return semver.parse(process.versions.node);
};

module.exports = getNodeVersion;
