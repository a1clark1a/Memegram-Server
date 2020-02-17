const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const MemesService = require("./memes-service");

const memesRouter = express.Router();
const jsonBodyParser = express.json();

memesRouter.route("/").get((req, res, next) => {
  res.send("all the memes");
  //TODO GET
  //TODO POST
});

memesRouter.route("/:memes_id").all((req, res, next) => {
  res.send("get one meme");
  //TODO GET
  //TODO DELETE
  //TODO PATCH
});

module.exports = memesRouter;
