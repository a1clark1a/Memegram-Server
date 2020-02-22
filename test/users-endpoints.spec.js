const app = require("../src/app");
const helpers = require("./test-helpers");
const bcrypt = require("bcryptjs");
const logger = require("../src/logger/logger");

describe("Users Endpoints", function() {
  let db;
  const { testUsers } = helpers.makeTestData();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = helpers.makeKnexInstance();
    if (!db) {
      logger.error(`Knex instance not created`);
    }
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the tables", () => helpers.cleanTables(db));

  beforeEach("clean the tables", () => helpers.cleanTables(db));

  //REGISTRATION TEST
  describe(`POST /api/users`, () => {
    context("User validation", () => {
      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      const requiredFields = ["user_name", "password", "full_name"];

      //MISSING FIELD IN REQUEST BODY WHEN REGISTERING TEST
      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: "test-user_name",
          password: "test-pass",
          full_name: "test-full_name"
        };

        it(`responds with 400 error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400);
        });
      });
    });
  });
});
