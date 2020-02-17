const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const CommentsService = require("./comments-service");

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter.route("/").get((req, res, next) => {
  res.send("all the comments");
  //TODO POST
});

commentsRouter.route("/:comments_id").all((req, res, next) => {
  res.send("get one comment");
  //TODO GET
  //TODO DELETE
  //TODO PATCH
});

module.exports = commentsRouter;
