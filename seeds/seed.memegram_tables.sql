BEGIN;

TRUNCATE 
memes_comments,
memes_tables,
memes_users
RESTART IDENTITY CASCADE;

INSERT INTO memes_users (user_name, full_name, password)
VALUES
('a1clark1a', 'Anthony Clark Perfecto', '$2a$12$B3VpZD1c4EE6u2QJ7Fmys.T6E4muzEYVcD.h2bXlXMhDp8nl9cylK'), 
('Demo', 'Demo Name', '$2a$12$qsdsDEuidFUTGbPWHN29O.QKiLuxovKMDOh4gpe8V.IxJqkxiYuKC'),
('memer', 'Memo Lemo', '$2a$12$9eZgd3XXb2ylDYncMCZXu.v.s7Q2FdBhTM/IXOyTZAvsqBpjOz/r.');


INSERT INTO memes_tables (title, description, url, upvote_count, downvote_count, user_id )
VALUES
('LOL ','Meme 1', 'https://www.fosi.org/media/images/funny-game-of-thrones-memes-coverimage.width-800.jpg',300, 2, 1),
('Funny','Coz Ie', 'https://images-cdn.9gag.com/photo/abYbvYp_460s.jpg',600, 15, 1),
('Hardcore programming 3','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 2),
('Hardcore programming 4','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 5','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 2),
('Hardcore programming 6','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',350, 50, 3),
('Hardcore programming 7','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 2),
('Hardcore programming 8','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 9','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 10','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 11','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 3),
('Hardcore programming 12','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 2),
('Hardcore programming 13','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 14','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 15','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1),
('Hardcore programming 16','Dude is programming so hard he didnt even turn on his laptop', 'https://i.picsum.photos/id/1/5616/3744.jpg',250, 10, 1);


INSERT INTO memes_comments (comment, memes_id, user_id)
VALUES
('Funny meme', 1, 1),
('Wow', 2, 1),
('Funny Wow', 1, 2),
('Cant stop laughing', 1, 3),
('Wowing forever', 3, 1),
('Laugh out loud', 4, 2),
('Laugh my a$$ out', 5, 3),
('Lmao so wow', 2, 2),
('lolololol', 6, 2),
('hehehehe memes', 7, 1),
('Funny meme 2', 8, 3),
('Wow 2', 9, 2),
('Funny Wow 2', 10, 3),
('Cant stop laughing 2', 11, 1),
('Wowing forever 2', 12, 2),
('Laugh out loud 2', 13, 3),
('Laugh my a$$ out', 14, 3),
('Lmao so wow', 15, 2),
('lolololol', 16, 2),
('hehehehe memes', 1, 2);

COMMIT;