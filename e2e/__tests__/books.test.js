const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('Books API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('books'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const book = {
    title: 'Moby Dick',
    author: 'Herman Melville',
    year: 1851
  };

  it.only('post a book for this user', () => {
    return request
      .post('/api/books')
      .set('Authorization', user.token)
      .send(book)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },

          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "author": "Herman Melville",
            "owner": Any<String>,
            "title": "Moby Dick",
            "year": 1851,
          }
        `
        );
      });
  });
});
