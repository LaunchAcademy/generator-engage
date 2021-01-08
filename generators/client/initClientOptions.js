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
  generator.option("router", {
    type: Boolean,
    default: true,
    description: "Configures react router",
  });
};

module.exports = initClientOptions;
