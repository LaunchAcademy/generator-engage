const getDatabaseUrl = nodeEnv => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/<%= name %>_development",
      test: "postgres://postgres:postgres@localhost:5432/<%= name %>_test"
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

export default getDatabaseUrl;
