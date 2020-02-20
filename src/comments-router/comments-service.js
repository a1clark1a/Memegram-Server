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
  },

  sanitizeComment(comment) {
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: new Date(comment.date_created).toLocaleString(),
      memes_id: comment.memes_id,
      user_id: comment.user_id
    };
  }
};

module.exports = CommentsService;
