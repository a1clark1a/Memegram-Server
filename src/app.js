require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./middleware/error-handler");
const memesRouter = require("./memes-router/memes-router");
const usersRouter = require("./users-router/users-router");
const authRouter = require("./auth/auth-router");
const commentsRouter = require("./comments-router/comments-router");

const app = express();

const morganOption = NODE_ENV === "production" ? " tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/memes", memesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

module.exports = app;
