const express = require("express");
const path = require("path");
const logger = require("../logger/logger");
const MemesService = require("./memes-service");

const memesRouter = express.Router();
const jsonBodyParser = express.json();

memesRouter.route("/").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  MemesService.getAllMemes(knexInstance)
    .then(memes => {
      logger.info(`memes requested`);
      res.json(memes.map(MemesService.sanitizedMemes));
    })
    .catch(next);
  //TODO POST
});

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
  });

//TODO DELETE
//TODO PATCH

module.exports = memesRouter;
