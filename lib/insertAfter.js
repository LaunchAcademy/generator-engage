import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import prettier from "prettier";

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
const insertAfter = (generator, snippetFile, destinationPath, matchFunc) => {
  const destinationFileContents = generator.fs.read(generator.destinationPath(destinationPath));
  const snippetFileContents = generator.fs.read(generator.templatePath(snippetFile));
  const tree = parse(destinationFileContents, { sourceType: "module" });
  const newTree = parse(snippetFileContents);
  let inserted = false;
  traverse(tree, {
    enter(path) {
      // eslint-disable-next-line no-debugger
      if (!inserted && matchFunc(path)) {
        path.insertAfter(newTree);
        inserted = true;
      }
    }
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

module.exports = insertAfter;
