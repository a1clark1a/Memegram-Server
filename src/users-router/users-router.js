const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const UsersService = require("./users-service");
const AuthService = require("../auth/auth-service");
const MemesService = require("../memes-router/memes-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route("/").get((req, res, next) => {
  //TODO FOR ADMIN
  //GET ALL USERS
  //DELETE A USER
  //BLOCK A USER

  //TODO FOR USERs
  //GET A USER BY ID

  res.send("all the users");
});

usersRouter
  .route("/:user_name")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { user_name } = req.params;
    //THEN GET ALL MEMES BY USERID
    AuthService.getUserWithUserName(knexInstance, user_name)
      .then(users => {
        if (!users) {
          logger.error(`Failed getting user on route /:user_name`);
          return res.status(404).json({
            error: { message: `User does not exist` }
          });
        }
        res.users = users;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(UsersService.sanitizeUser(res.users));
  });

usersRouter.route("/:user_id/memes").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { user_id } = req.params;
  UsersService.getAllMemesUploadedByUserId(knexInstance, user_id)
    .then(memes => {
      logger.info("memes retrieved");
      res.json(memes.map(MemesService.sanitizedMemes));
    })
    .catch(next);
});

//API CALL FOR REGISTERING A NEW USER
usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { password, user_name, full_name } = req.body;

  //VALIDATE request body and MUST contain all fields
  for (const field of ["full_name", "user_name", "password"]) {
    if (!req.body[field]) {
      logger.error(`${field} missing`);
      return res.status(400).json({
        error: { message: ` Missing '${field}' in request body` }
      });
    }
  }

  //VALIDATE password
  const passwordError = UsersService.validatePassword(password);
  if (passwordError) {
    logger.error(passwordError);
    return res.status(400).json({
      error: { message: passwordError }
    });
  }

  //USER_NAME must be unique so check
  UsersService.hasUserWithUserName(knexInstance, user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName) {
        logger.error("Similar Username exist must be unique");
        return res.status(400).json({
          error: { message: `Username already taken` }
        });
      }

      //HASH password with bcryptjs
      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          full_name,
          password: hashedPassword,
          date_created: new Date().toLocaleString("en", { timeZone: "UTC" })
        };
        //WHEN ALL VALIDATION AND HASHING IS DONE then insert user to database
        return UsersService.insertUser(knexInstance, newUser).then(user => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(UsersService.sanitizeUser(user));
        });
      });
    })
    .catch(next);
});

module.exports = usersRouter;
