const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route("/").get((req, res, next) => {
  res.send("all the users");
  //TODO POST
});

usersRouter.route("/:users_id").all((req, res, next) => {
  res.send("get one user");
  //TODO GET
  //TODO DELETE
  //TODO PATCH
});

module.exports = usersRouter;
