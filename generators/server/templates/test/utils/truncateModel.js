import config from "../../src/config.js";

/**
 *
 * @typedef {typeof import("../../src/models/Model.js")} ModelClass
 * @export
 * @param {ModelClass} modelClass
 * @returns
 */
export default async function truncateModel(modelClass) {
  if (config.nodeEnv !== "test") {
    throw Error(
      "don't use table truncation test utility script outside of the 'test' node environment"
    );
  }

  if (modelClass) {
    await modelClass
      .knex()
      .raw(`TRUNCATE TABLE :tableName: CASCADE`, { tableName: modelClass.tableName() });
  }
}
