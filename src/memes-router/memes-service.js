const xss = require("xss");

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name",
  "usr.date_created AS user:date_created"
];

//CRUD SERVICE FOR MEMES REQUESTS

const MemesService = {
  getAllMemes(knex) {
    return knex
      .from("memes_tables AS m")
      .select("*")
      .orderBy("date_created", "desc");
  },

  insertMemes(knex, newMemes) {
    return knex
      .insert(newMemes)
      .into("memes_tables")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getMemesById(knex, memesId) {
    return knex
      .from("memes_tables")
      .select("*")
      .where("id", memesId)
      .first();
  },

  getCommentsForClickedMeme(knex, memesId) {
    return knex
      .from("memes_comments AS com")
      .select("*")
      .where("com.memes_id", memesId);
  },

  getMemesPoster(knex, userId) {
    return knex
      .from("memes_users")
      .where("id", userId)
      .first();
  },

  updateMeme(knex, memesid, memesToUpdate) {
    return knex("memes_tables")
      .where("id", memesid)
      .update(memesToUpdate);
  },

  deleteMemes(knex, memesId) {},

  sanitizedMemes(memes) {
    return {
      id: memes.id,
      title: xss(memes.title),
      description: xss(memes.description),
      url: memes.url,
      user_id: memes.user_id,
      upvote_count: Number(memes.upvote_count) || 0,
      downvote_count: Number(memes.downvote_count) || 0,
      date_created: new Date(memes.date_created).toLocaleString()
    };
  },
  sanitizedComments(comment) {
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: new Date(comment.date_created).toLocaleString(),
      memes_id: comment.memes_id,
      user_id: comment.user_id
    };
  }
};

module.exports = MemesService;
