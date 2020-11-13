const initClientOptions = (generator) => {
  generator.option("outputDir", {
    type: String,
    default: "dist",
    description: "relative path to webpack output dir",
  });
  generator.option("cssFramework", {
    type: String,
    default: "foundation",
    description: "css framework (foundation,none)",
  });
};

module.exports = initClientOptions;
