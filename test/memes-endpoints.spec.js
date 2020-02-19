const app = require("../src/app");
const helpers = require("./test-helpers");
const logger = require("../src/logger/logger");

describe("Memes Endpoints", () => {
  let db;
  const { testUsers, testMemes, testComments } = helpers.makeTestData();
  const {
    expectedUsers,
    expectedMemes,
    expectedComments
  } = helpers.makeExpectedTestData();

  before("make knex instance", () => {
    db = helpers.makeKnexInstance();
    if (!db) {
      logger.error(`Knex instance not created`);
    }
    app.set("db", db);
  });

  after("disconnect from the db", () => db.destroy());

  before("clean the table", () => helpers.cleanTables(db));

  afterEach("clean the table", () => helpers.cleanTables(db));

  describe(`GET /api/memes`, () => {
    context(`Given no memes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/memes")
          .expect(200, []);
      });
    });

    context(`Given there are memes in the database`, () => {
      beforeEach("insert memes", () => {
        return helpers.seedMemesTables(db, testUsers, testMemes, testComments);
      });

      it(`responds with 200 and all of the memes`, () => {
        return supertest(app)
          .get("/api/memes")
          .expect(200, expectedMemes);
      });
    });
  });
});
