const xss = require("xss");
const Treeize = require("treeize");

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
      .from("memes_tables AS memes")
      .select(
        "memes.id",
        "memes.title",
        "memes.url",
        "memes.upvote_count",
        "memes.downvote_count",
        "memes.user_id",
        ...userFields
      )
      .leftJoin("memes_users AS usr", "memes.user_id", "usr.id")
      .where("memes.id", memesId)
      .first();
  },

  getCommentsForClickedMeme(knex, memesId) {
    return knex
      .from("memes_comments AS com")
      .select(
        "com.id",
        "com.comment",
        "com.memes_id",
        "com.date_created",
        "com.user_id",
        ...userFields
      )
      .leftJoin("memes_users AS usr", "com.user_id", "usr.id")
      .where("com.memes_id", memesId)
      .orderBy("com.date_created", "asc");
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

  deleteMemes(knex, memesId, userId) {
    return knex("memes_tables")
      .where({ id: memesId, user_id: userId })
      .first()
      .delete();
  },

  sanitizedMemes(memes) {
    const memesTree = new Treeize();
    const memesData = memesTree.grow([memes]).getData()[0];
    return {
      id: memes.id,
      title: xss(memes.title),
      description: xss(memes.description),
      url: memes.url,
      user_id: memes.user_id,
      user: memesData.user || {},
      upvote_count: Number(memes.upvote_count) || 0,
      downvote_count: Number(memes.downvote_count) || 0,
      date_created: new Date(memes.date_created).toLocaleString()
    };
  },
  sanitizedComments(comment) {
    const commentTree = new Treeize();
    const commentData = commentTree.grow([comment]).getData()[0];

    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: new Date(comment.date_created).toLocaleString(),
      memes_id: comment.memes_id,
      user_id: comment.user_id,
      user: commentData.user || {}
    };
  }
};

module.exports = MemesService;
