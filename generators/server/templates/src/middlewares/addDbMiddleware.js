import config from "../config.js";
import pg from "pg";

const addDbMiddleware = app => {
  const pool = new pg.Pool({
    connectionString: config.databaseUrl
  });

  app.use((req, res, next) => {
    req.db = { pool };
    next();
  });
};

export default addDbMiddleware;
