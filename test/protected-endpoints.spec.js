const app = require("../src/app");
const helpers = require("./test-helpers");
const logger = require("../src/logger/logger");

describe(`Protected Endpoints`, () => {
  let db;
  const { testUsers, testMemes, testComments } = helpers.makeTestData();

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

  beforeEach("insert test data", () =>
    helpers.seedMemesTables(db, testUsers, testMemes, testComments)
  );

  //TESTING FOR `USER MUST BE LOGGED IN REQUIRED` REQUESTS
  const protectedEndpoints = [
    {
      name: "Post /api/comments",
      path: "/api/comments",
      method: supertest(app).post
    },
    {
      name: "Post /api/memes",
      path: "/api/memes",
      method: supertest(app).post
    },
    {
      name: "Get /api/users/:user_id",
      path: "/api/users/1",
      method: supertest(app).get
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      context(`Unauthorized request`, () => {
        it(`responds with 401 'Missing bearer token when no bearer token`, () => {
          return endpoint
            .method(endpoint.path)
            .expect(401, { error: { message: `Missing bearer token` } });
        });

        it(`responds with 401 'Unauthorized request' when invalid JWT secret`, () => {
          const validUser = testUsers[0];
          const invalidSecret = "bad-secret";
          return endpoint
            .method(endpoint.path)
            .set(
              "Authorization",
              helpers.makeAuthHeader(validUser, invalidSecret)
            )
            .expect(401, { error: { message: `Unauthorized request` } });
        });

        it(`responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
          const invalidUser = {
            user_name: "not a user",
            id: 1
          };
          return endpoint
            .method(endpoint.path)
            .set("Authorization", helpers.makeAuthHeader(invalidUser))
            .expect(401, { error: { message: `Unauthorized request` } });
        });
      });
    });
  });
});
