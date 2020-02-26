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
      .select(
        "com.id",
        "com.comment",
        "com.memes_id",
        "com.user_id",
        "com.date_created",
        knex.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
              usr.id,
              usr.user_name,
              usr.full_name,
              usr.date_created
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin("memes_users As usr", "com.user_id", "usr.id")
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
