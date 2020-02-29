// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbsMiddleware({
    defaultLayout: "default",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");
