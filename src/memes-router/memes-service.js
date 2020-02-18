const xss = require("xss");

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name",
  "usr.date_created AS user:date_created"
];

const MemesService = {
  getAllMemes(knex) {
    return knex.from("memes_tables AS m").select("*");
  },

  insertMemes(knex, newMemes) {
    //inser memes here
  },

  getMemesById(knex, memesId) {
    return knex
      .from("memes_tables")
      .select("*")
      .where("id", memesId)
      .first();
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
      date_created: new Date(memes.date_created)
    };
  }
};

module.exports = MemesService;
