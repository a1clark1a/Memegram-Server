const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const MemesService = require("./memes-service");
const UsersService = require("../users-router/users-service");
const { requireAuth } = require("../middleware/jwt-auth");

const memesRouter = express.Router();
const jsonBodyParser = express.json();

//API CALL FOR A LIST OF ALL MEMES
memesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    MemesService.getAllMemes(knexInstance)
      .then(memes => {
        logger.info(`all memes requested`);
        res.json(memes.map(MemesService.sanitizedMemes));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { title, description, user_id, url } = req.body;
    const newMeme = { title, description, user_id, url };
    const knexInstance = req.app.get("db");

    for (const [key, value] of Object.entries(newMeme)) {
      if (value == null) {
        logger.error(`Missing ${key} in request body`);
        return res.status(400).json({
          error: {
            message: `Uploading a Meme requires a Title, Description and URL and User Id`
          }
        });
      }
    }

    newMeme.upvote_count = 0;
    newMeme.downvote_count = 0;
    MemesService.insertMemes(knexInstance, newMeme)
      .then(meme => {
        if (!meme) {
          logger.error("Error inserting meme");
        }
        logger.info(
          `Meme with uploaded by user with user.id ${meme.user_id} successfully uploaded`
        );
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${meme.id}`))
          .json(MemesService.sanitizedMemes(meme));
      })
      .catch(next);
  });

//API CALL FOR A SINGLE MEME
memesRouter
  .route("/:memes_id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { memes_id } = req.params;
    MemesService.getMemesById(knexInstance, memes_id)
      .then(memes => {
        if (!memes) {
          logger.error("ERROR in `MemesService.getMemesById");
          return res.status(404).json({
            error: { message: `Meme does not exist` }
          });
        }
        res.memes = memes;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(MemesService.sanitizedMemes(res.memes));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      title,
      upvote_count,
      downvote_count,
      url,
      description,
      user_id
    } = req.body;
    const updatedMeme = {
      title,
      upvote_count,
      downvote_count,
      url,
      description,
      user_id
    };
    const { memes_id } = req.params;

    const numberOfReqBodyVal = Object.values(updatedMeme).filter(Boolean)
      .length;
    if (numberOfReqBodyVal === 0) {
      logger.error("Patch request is missing at least one field");
      return res.status(400).json({
        error: {
          message: `Request body must contain either a title, upvote_count, downvote_count, url or description`
        }
      });
    }
    MemesService.updateMeme(knexInstance, memes_id, updatedMeme)
      .then(updatedRows => {
        if (!updatedRows) {
          logger.error("updating went wrong");
          return res.status(400).json({
            error: { message: "Unable to update" }
          });
        }
        logger.info(
          `Successfully added an upvote on the meme with ${memes_id} id`
        );
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { user_id } = req.body;
    const { memes_id } = req.params;
    MemesService.deleteMemes(knexInstance, memes_id, user_id)
      .then(() => {
        logger.info(
          `Successfully delete a meme with id ${memes_id} uploaded by user with id ${user_id}`
        );
        res.status(204).end();
      })
      .catch(next);
  });

//API CALL FOR COMMENTS FOR EACH MEMES
memesRouter.route("/:memes_id/comments").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { memes_id } = req.params;
  MemesService.getCommentsForClickedMeme(knexInstance, memes_id)
    .then(comments => {
      logger.info("Comments retrieved");
      res.json(comments.map(MemesService.sanitizedComments));
    })
    .catch(next);
});

//API CALL FOR A USER FOR EACH MEMES
memesRouter.route("/:user_id/users").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { user_id } = req.params;
  UsersService.getUserById(knexInstance, user_id)
    .then(user => {
      logger.info("User retreived");
      res.json(UsersService.sanitizeUser(user));
    })
    .catch(next);
});

//TODO GET COMMENT COUNT FOR EACH IMAGE

module.exports = memesRouter;
