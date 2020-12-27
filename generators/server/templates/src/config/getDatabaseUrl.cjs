const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/<%= name %>_development",
      test: "postgres://postgres:postgres@localhost:5432/<%= name %>_test",
      e2e: "postgres://postgres:postgres@localhost:5432/<%= name %>_e2e",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
