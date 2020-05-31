app.set("views", path.join(import.meta.url, "views"));
app.engine(
  "hbs",
  hbsMiddleware({
    defaultLayout: "default",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");
