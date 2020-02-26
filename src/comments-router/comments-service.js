const xss = require("xss");

const CommentsService = {
  insertComments(knex, newComments) {
    return knex
      .into("memes_comments")
      .insert(newComments)
      .returning("*")
      .then(([comment]) => comment)
      .then(comment => CommentsService.getCommentsById(knex, comment.id));
  },

  getCommentsById(knex, commentsId) {
    return knex
      .from("memes_comments AS com")
      .select("*")
      .where("com.id", commentsId)
      .first();
  },

  deleteComments(knex, commentsId) {
    return knex("memes_comments")
      .where({ commentsId })
      .delete();
  }
};

module.exports = CommentsService;
