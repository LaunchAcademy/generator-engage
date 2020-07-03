const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const prettier = require("prettier");

/**
 * @typedef {import("@babel/traverse").NodePath} NodePath
 * @typedef {import("yeoman-generator")} Generator
 * /

/**
 * Inserts a snippet of code after a matching path
 *
 * @param {Generator} generator the Yeoman generator
 * @param {*} snippetFile
 * @param {*} destinationPath
 * @param {MatchCallback} matchFunc
 */
module.exports = (generator, snippetFile, destinationPath, matchFunc) => {
  const destinationFileContents = generator.fs.read(generator.destinationPath(destinationPath));
  const snippetFileContents = generator.fs.read(generator.templatePath(snippetFile));
  const tree = parser.parse(destinationFileContents, {
    sourceType: "module",
    plugins: ["importMeta"],
  });
  const newTree = parser.parse(snippetFileContents, {
    sourceType: "module",
    plugins: ["importMeta"],
  });
  let inserted = false;
  traverse(tree, {
    enter(path) {
      // eslint-disable-next-line no-debugger
      if (!inserted && matchFunc(path)) {
        path.insertAfter(newTree);
        inserted = true;
      }
    },
  });
  const { code } = generate(tree, {}, destinationFileContents);
  generator.fs.write(
    generator.destinationPath(destinationPath),
    prettier.format(code, { parser: "babel" })
  );
};

/**
 * @callback MatchCallback function to determine whether code should be inserted
 * @param {NodePath} path what is being traversed
 */
