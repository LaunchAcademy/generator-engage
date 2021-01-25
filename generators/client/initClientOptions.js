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
  // this is duplicated on the server side
  generator.option("authentication", {
    default: "passport",
    type: String,
    description: `Authentication engine to use. Valid values are: passport, none`,
  });
};

module.exports = initClientOptions;
