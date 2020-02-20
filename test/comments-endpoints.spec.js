const app = require("../src/app");
const helpers = require("./test-helpers");
const logger = require("../src/logger/logger");

describe(`Comments Endpoints`, function() {
  let db;
  const { testUsers, testMemes } = helpers.makeTestData();

  before("make knex instance", () => {
    db = helpers.makeKnexInstance();
    if (!db) {
      logger.error(`Knex instance not created`);
    }
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the tables", () => helpers.cleanTables(db));

  afterEach("clean the tables", () => helpers.cleanTables(db));

  //TESTING comment posting with proper user auth
  describe(`POST /api/comments`, () => {
    beforeEach("insert test data", () => {
      return helpers.seedMemesTables(db, testUsers, testMemes);
    });

    it(`creates a comment, responding with a 201 and the new comment`, function() {
      this.retries(3);
      const testMeme = testMemes[0];
      const testUser = testUsers[0];
      const newComment = {
        comment: "TEST COMMENT",
        memes_id: testMeme.id
      };
      return supertest(app)
        .post("/api/comments")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.comment).to.eql(newComment.comment);
          expect(res.body.memes_id).to.eql(newComment.memes_id);
          expect(res.body.user_id).to.eql(testUser.id);
          const expectedDate = new Date().toLocaleString("en", {
            timeZone: "UTC"
          });
          expect(res.body.date_created).to.eql(expectedDate);
        })
        .expect(res =>
          db
            .from("memes_comments")
            .select("*")
            .where({ id: res.body.id })

            .first()
            .then(row => {
              expect(row.comment).to.eql(newComment.comment);
              expect(row.memes_id).to.eql(newComment.memes_id);
              expect(row.user_id).to.eql(testUser.id);
              const expectedDate = new Date().toLocaleString("en", {
                timeZone: "UTC"
              });
              expect(res.body.date_created).to.eql(expectedDate);
            })
        );
    });
  });
});
