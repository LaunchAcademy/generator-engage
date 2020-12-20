/**
 *
 * @typedef {typeof import("../../src/models/Model.js")} ModelClass
 * @export
 * @param {ModelClass} modelClass
 * @returns
 */
module.exports = async function truncateModel(modelClass) {
  if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "e2e") {
    throw Error(
      "don't use table truncation test utility script outside of the 'test' node environment"
    );
  }

  if (modelClass) {
    await modelClass
      .knex()
      .raw(`TRUNCATE TABLE :tableName: CASCADE`, { tableName: modelClass.tableName });
  }
};
