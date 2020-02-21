CREATE TABLE memes_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT,
    about TEXT,
    date_created TIMESTAMP NOT NULL DEFAULT now()

);

ALTER TABLE memes_tables
ADD COLUMN user_id INTEGER REFERENCES memes_users(id)
ON DELETE SET NULL;