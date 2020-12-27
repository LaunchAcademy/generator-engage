const truncateModel = require("../../../server/test/utils/truncateModel.cjs");
const connection = require("../../../server/src/boot/model.cjs");
const modelList = require("../../../server/src/models");

const truncate = async (models) => {
  let modelsToTruncate = models;
  if (!Array.isArray(modelsToTruncate)) {
    modelsToTruncate = [modelsToTruncate];
  }

  for (const model of modelsToTruncate) {
    console.log(modelList[model]);
    await truncateModel(modelList[model]);
  }
  await connection.client.pool.release();
  return 1;
};

const insert = async ({ modelName, json }) => {
  const result = await modelList[modelName].query().insertGraph(json);
  await connection.client.pool.release();
  return result;
};

const update = async ({ modelName, conditions = {}, json }) => {
  const result = await modelList[modelName].query().patch(json).where(conditions);
  await connection.client.pool.release();
  return result;
};

const find = async ({ modelName, conditions = {} }) => {
  const result = await modelList[modelName].query().where(conditions);
  await connection.client.pool.release();
  return result;
};

const deleteRecords = async ({ modelName, conditions = {} }) => {
  const result = await modelList[modelName].query().delete().where(conditions);
  await connection.client.pool.release();
  return result;
};

module.exports = {
  find,
  deleteRecords,
  insert,
  truncate,
  update,
};
