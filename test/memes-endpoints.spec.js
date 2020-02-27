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

  //TESTING FOR MEMES LIST REQUEST
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

    context(`Given an XSS attack meme`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousMeme, expectedMemeForMalic } = helpers.makeMaliciousMeme(
        testUser
      );

      beforeEach("insert malicious data", () => {
        return helpers.seedMaliciousMeme(db, testUser, maliciousMeme);
      });

      it("removes XSS attack scripts", () => {
        return supertest(app)
          .get("/api/memes")
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedMemeForMalic.title);
            expect(res.body[0].description).to.eql(
              expectedMemeForMalic.description
            );
            expect(res.body[0].date_created).to.eql(
              expectedMemeForMalic.date_created
            );
          });
      });
    });
  });

  //TESTING FOR INDIVIDUAL MEMES REQUEST
  describe(`GET /api/memes/:memes_id`, () => {
    context(`Given no memes`, () => {
      it(`responds with 404`, () => {
        const memeId = 123456;
        return supertest(app)
          .get(`/api/memes/${memeId}`)
          .expect(404, {
            error: {
              message: `Meme does not exist`
            }
          });
      });
    });

    context(`Given there are memes in the database`, () => {
      beforeEach(`insert memes`, () => {
        return helpers.seedMemesTables(db, testUsers, testMemes, testComments);
      });

      it(`responds with 200 and the specified meme`, () => {
        const memeId = 2;
        const meme = helpers.makeExpectedMemes(
          expectedUsers,
          expectedMemes[memeId - 1],
          expectedComments
        );

        return supertest(app)
          .get(`/api/memes/${memeId}`)
          .expect(200, meme);
      });
    });
  });

  //TESTING FOR UPLOADING MEME URL
  describe(`POST /api/memes`, () => {
    //MISSING FIELD IN REQUEST BODY
    context(`Given incomplete field`, () => {
      beforeEach("insert user", () => {
        return helpers.seedUsers(db, testUsers);
      });

      const requiredField = ["title", "description", "url", "user_id"];

      requiredField.forEach(field => {
        uploadAttemptBody = {
          title: "upload-test",
          description: "description test",
          user_id: testUsers[0].user_id,
          url:
            "https://www.memesmonkey.com/images/memesmonkey/9d/9d97bc2e378d885d36c40d37167ae86e.gif"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete uploadAttemptBody[field];

          return supertest(app)
            .post(`/api/memes`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(uploadAttemptBody)
            .expect(400, {
              error: {
                message: `Uploading a Meme requires a Title, Description and URL and User Id`
              }
            });
        });
      });
    });

    context(`uploading with complete field`, () => {
      beforeEach("insert user", () => {
        return helpers.seedUsers(db, testUsers);
      });
      const uploadBody = {
        title: "upload-test",
        description: "description test",
        user_id: testUsers[0].id,
        url:
          "https://www.memesmonkey.com/images/memesmonkey/9d/9d97bc2e378d885d36c40d37167ae86e.gif"
      };

      it(`responds 200 and the uploaded meme with correct credentials`, () => {
        return supertest(app)
          .post(`/api/memes`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(uploadBody)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("user");
            expect(res.body.title).to.eql(uploadBody.title);
            expect(res.body.description).to.eql(uploadBody.description);
            expect(res.body.url).to.eql(uploadBody.url);
            expect(res.body.user_id).to.eql(uploadBody.user_id);
          });
      });

      it(`responds 401 Missing bearer token when uploading with incorrect credentials`, () => {
        return supertest(app)
          .post(`/api/memes`)
          .send(uploadBody)
          .expect(401, {
            error: { message: `Missing bearer token` }
          });
      });
    });
  });
});
