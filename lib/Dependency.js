class Dependency {
  constructor(packageName, version = null, { dev = false }) {
    this.packageName = packageName;
    this.version = version;
    this.dev = dev;
  }

  toString() {
    if (this.version) {
      return `${this.packageName}@${this.version}`;
    }
    return this.packageName;
  }
}

module.exports = Dependency;
