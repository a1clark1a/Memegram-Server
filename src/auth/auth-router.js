const express = require("express");
const AuthService = require("./auth-service");
const logger = require("../logger/logger");

const authRouter = express.Router();
const jsonBodyParser = express.json();

//API CALL FOR LOGGING IN

authRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  //VALIDATE Login request body must have user_name and password;
  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      logger.error(`${key} missing`);
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      });
    }
  }

  //GET USER
  AuthService.getUserWithUserName(knexInstance, loginUser.user_name)
    .then(dbUser => {
      if (!dbUser) {
        logger.error("error retreiving dbuser");
        return res.status(400).json({
          error: { message: `Incorrect user_name or password` }
        });
      }
      //VALIDATE password to check with hashed password
      return AuthService.comparePassword(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch) {
          return res.status(400).json({
            error: { message: `Incorrect user_name or password` }
          });
        }
        //CREATE JWT
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
