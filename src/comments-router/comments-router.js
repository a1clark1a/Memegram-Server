const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const CommentsService = require("./comments-service");
const MemesService = require("../memes-router/memes-service");
const { requireAuth } = require("../middleware/jwt-auth");

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter.route("/").get(requireAuth, (req, res, next) => {
  //TODO FOR ADMIN
  //GET ALL COMMENTS
  res.send("all the comments");
});

//API CALL FOR MAKING A COMMENT
commentsRouter
  .route("/")
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { memes_id, comment } = req.body;
    const newComment = { memes_id, comment };

    //VALIDATE request body MUST contain all fields
    for (const [key, value] of Object.entries(newComment)) {
      if (value == null) {
        logger.error(`${field} missing`);
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    newComment.user_id = req.user.id;
    CommentsService.insertComments(knexInstance, newComment)
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(MemesService.sanitizedComments(comment));
      })
      .catch(next);
    //TODO DELETE
  });

module.exports = commentsRouter;
