# Memegram - Server API

## LIVE APP:

- Memegram-Client = https://memegram.now.sh/
- Memegram-API_Endpoint = https://thawing-mesa-40257.herokuapp.com/api

## Summary

- A Node.js, Express and PostreSQL server API that handles CRUD requests for the memegram app. This server utilizes RESTful API architecture, mocha, chai and supertest endpoints testing and validation, JWT and bcryptjs hashing authentication, XSS cross-site scripting sanitation, and Knex library for query building and database management.

## Tech Stack

- JavaScript ES6
- Node.js
- Express
- Mocha, Chai and Supertest
- PostgreSQL
- Morgan and Winston logger
- Knex
- XSS
- bcryptjs
- jsonwebtoken
- Treeize

## API-ENDPOINTS

### memes

- `/GET /api/memes`

- `/GET /api/memes/:memes_id`

- `/GET /api/memes/:memes_id/comments`

- `/GET /api/memes/:user_id/users`

- `/POST /api/memes` - Request body needs a title, description, user_id, url parameter

- `/DELETE /api/memes/:memes_id`

- `/PATCH /api/memes/:memes_id` (Not fully implemented)

### users

- `/GET /api/users` - (In development for Admin user feature)

- `/GET /api/users/:user_id`

- `/GET /api/users/:user_id/memes"`

- `/POST /api/users` - Request body needs a password, user_name, full_name

- `/DELETE /api/users/:user_id` (In development for Admin user feature)

### comments

- `/POST /api/comments`

- `/DE:ETE /api/comments/:comments_id` (In development for deleting a user-made comment)

## In Development

- Connect to an Image Hosting sight for uploading image files.
- Delete a comment endpoints
- updating images/comments/users endpoints
- Adding columns and relation to tables in DB for categories/tags feature
- Delete a user account endpoints
