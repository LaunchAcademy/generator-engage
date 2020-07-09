import knex from "knex";
import { Model } from "objection";

import knexConfig from "../../knexfile.cjs";

const knexConnection = knex(knexConfig);

Model.knex(knexConnection);
