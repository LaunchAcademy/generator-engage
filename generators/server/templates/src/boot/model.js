import knex from "knex";
import objection from "objection";

import knexConfig from "../../knexfile.cjs";

const knexConnection = knex(knexConfig);

objection.Model.knex(knexConnection);

export default knexConnection;
