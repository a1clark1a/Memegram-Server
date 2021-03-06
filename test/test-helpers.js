const knex = require("knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeMemesArray(users) {
  return [
    {
      id: 1,
      title: "Meme 1",
      description: "Very funny meme 1",
      user_id: users[0].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 250,
      downvote_count: 10,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 2,
      title: "Meme 2",
      description: "Very funny meme 2",
      user_id: users[1].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 150,
      downvote_count: 20,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 3,
      title: "Meme 3",
      description: "Very funny meme 3",
      user_id: users[2].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 230,
      downvote_count: 30,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 4,
      title: "Meme 4",
      description: "Very funny meme 4",
      user_id: users[0].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 450,
      downvote_count: 40,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 5,
      title: "Meme 5",
      description: "Very funny meme 5",
      user_id: users[1].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 50,
      downvote_count: 50,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 6,
      title: "Meme 6",
      description: "Very funny meme 6",
      user_id: users[2].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 60,
      downvote_count: 610,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    }
  ];
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "test-full-name-1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "test-full-name-2",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "test-full-name-3",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z")
    }
  ];
}

function makeCommentsArray(users, memes) {
  return [
    {
      id: 1,
      comment: "WOW AWESOME MEME 1",
      memes_id: memes[0].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 2,
      comment: "WOW AWESOME MEME 2",
      memes_id: memes[1].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 3,
      comment: "WOW AWESOME MEME 3",
      memes_id: memes[2].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 4,
      comment: "WOW AWESOME MEME 4",
      memes_id: memes[3].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 5,
      comment: "WOW AWESOME MEME 5",
      memes_id: memes[4].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z")
    }
  ];
}

function makeTestData() {
  const testUsers = makeUsersArray();
  const testMemes = makeMemesArray(testUsers);
  const testComments = makeCommentsArray(testUsers, testMemes);
  return { testUsers, testMemes, testComments };
}

function makeExpectedTestData() {
  const expectedUsers = makeExpectedUsersArray();
  const expectedMemes = makeExpectedMemesArray(expectedUsers);
  const expectedComments = makeExpectedCommentsArray(
    expectedUsers,
    expectedMemes
  );
  return { expectedUsers, expectedMemes, expectedComments };
}

function makeExpectedMemesArray(users) {
  return [
    {
      id: 1,
      title: "Meme 1",
      description: "Very funny meme 1",
      user_id: users[0].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 250,
      downvote_count: 10,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    },
    {
      id: 2,
      title: "Meme 2",
      description: "Very funny meme 2",
      user_id: users[1].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 150,
      downvote_count: 20,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    },
    {
      id: 3,
      title: "Meme 3",
      description: "Very funny meme 3",
      user_id: users[2].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 230,
      downvote_count: 30,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    },
    {
      id: 4,
      title: "Meme 4",
      description: "Very funny meme 4",
      user_id: users[0].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 450,
      downvote_count: 40,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    },
    {
      id: 5,
      title: "Meme 5",
      description: "Very funny meme 5",
      user_id: users[1].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 50,
      downvote_count: 50,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    },
    {
      id: 6,
      title: "Meme 6",
      description: "Very funny meme 6",
      user_id: users[2].id,
      url: "https://i.picsum.photos/id/1/5616/3744.jpg",
      upvote_count: 60,
      downvote_count: 610,
      date_created: new Date("2029-01-22T16:28:32.615Z").toLocaleString(),
      user: {}
    }
  ];
}

function makeExpectedCommentsArray(users, memes) {
  return [
    {
      id: 1,
      comment: "WOW AWESOME MEME 1",
      memes_id: memes[0].id,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      comment: "WOW AWESOME MEME 2",
      memes_id: memes[1].id,
      user_id: users[1].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      comment: "WOW AWESOME MEME 3",
      memes_id: memes[2].id,
      user_id: users[2].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      comment: "WOW AWESOME MEME 4",
      memes_id: memes[3].id,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 5,
      comment: "WOW AWESOME MEME 5",
      memes_id: memes[4].id,
      user_id: users[1].id,
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

function makeExpectedUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "test-full-name-1",
      password: "passwprd",
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "test-full-name-2",
      password: "passwprd",
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "test-full-name-3",
      password: "passwprd",
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

//HELPER FUNCTION FOR XSS TESTING
function makeExpectedMemes(users, memes, comments = []) {
  const user = users.find(user => user.id === memes.user_id);

  //TODO TEST NUMBER OF COMMENTS IN A MEME
  const memesComment = comments.filter(
    comment => comment.memes_id === memes.id
  );

  return {
    id: memes.id,
    url: memes.url,
    title: memes.title,
    description: memes.description,
    upvote_count: memes.upvote_count,
    downvote_count: memes.downvote_count,
    date_created: memes.date_created,
    user_id: memes.user_id,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      date_created: user.date_created
    }
  };
}

function makeMaliciousMeme(user) {
  const maliciousMeme = {
    id: 666,
    url: "http://placehold.it/500x500",
    date_created: new Date().toLocaleString(),
    title: 'BAD TITLE BAD! <script>alert("xss");</script>',
    user_id: user.id,
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  };
  const expectedMemeForMalic = {
    ...makeExpectedMemes([user], maliciousMeme),
    title: 'BAD TITLE BAD! &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };

  return {
    maliciousMeme,
    expectedMemeForMalic
  };
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("memes_users")
    .insert(preppedUsers)
    .then(() => {
      return db.raw(`SELECT setval('memes_users_id_seq', ?)`, [
        users[users.length - 1].id
      ]);
    });
}

function seedMemesTables(db, users, memes, comments = []) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("memes_tables").insert(memes);
    await trx.into("memes_comments").insert(comments);
    await trx.raw(`SELECT setval('memes_tables_id_seq', ?)`, [
      memes[memes.length - 1].id
    ]);
  });
}

function seedMaliciousMeme(db, user, meme) {
  return seedUsers(db, [user]).then(() => {
    return db.into("memes_tables").insert([meme]);
  });
}

function makeKnexInstance() {
  return knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE 
        memes_tables,
        memes_users,
        memes_comments
        RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  cleanTables,

  makeKnexInstance,
  makeUsersArray,
  makeMemesArray,
  makeCommentsArray,

  makeExpectedMemesArray,
  makeExpectedMemes,
  makeExpectedCommentsArray,
  makeExpectedUsersArray,

  makeExpectedTestData,
  makeTestData,
  makeAuthHeader,

  seedUsers,
  seedMemesTables,

  makeMaliciousMeme,
  seedMaliciousMeme
};
