const xss = require("xss");
const bcrypt = require("bcryptjs");
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getUserById(knex, userId) {
    return knex
      .from("memes_users")
      .where("id", userId)
      .first();
  },

  getAllMemesUploadedByUserId(knex, userId) {
    return knex
      .from("memes_tables")
      .select("*")
      .where("user_id", userId);
  },

  hasUserWithUserName(knex, user_name) {
    return knex("memes_users")
      .where({ user_name })
      .first()
      .then(user => !!user);
  },

  insertUser(knex, newUser) {
    return knex
      .into("memes_users")
      .insert(newUser)
      .returning("*")
      .then(([user]) => user);
  },

  validatePassword(password) {
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  sanitizeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      about: xss(user.about),
      profile_pic: xss(user.profile_pic),
      date_created: new Date(user.date_created).toLocaleString()
    };
  }
};

module.exports = UsersService;
