const knex = require("knex");
const objection = require("objection");
const knexConfig = require("../../knexfile.cjs");

const knexConnection = knex(knexConfig);

objection.Model.knex(knexConnection);

module.exports = knexConnection;
