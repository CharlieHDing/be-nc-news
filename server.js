const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router.js");
const { invalidPaths, Error400, Error404, Error500} = require("./errors/errors");

app.use(express.json())

app.use("/api", apiRouter);

app.all("/*", invalidPaths);

app.use(Error400)

app.use(Error404)

app.use(Error500)

module.exports = app;