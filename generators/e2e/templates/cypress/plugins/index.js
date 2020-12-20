const { insert, truncate, find, deleteRecords, update } = require("./db");

/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on("task", {
    "db:truncate"(models) {
      return truncate(models);
    },
    "db:insert"({ modelName, json }) {
      return insert({ modelName, json });
    },
    "db:find"({ modelName, conditions }) {
      return find({ modelName, conditions });
    },
    "db:delete"({ modelName, conditions }) {
      return deleteRecords({ modelName, conditions });
    },
    "db:update"({ modelName, conditions, json }) {
      return update({ modelName, conditions, json });
    },
  });
  return config;
};
