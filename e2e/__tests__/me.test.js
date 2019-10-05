const request = require('../request');
const db = require('../db');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');

describe('Me API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('books'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const book1 = {
    title: 'Moby Dick',
    author: 'Herman Melville',
    year: 1851
  }

  function postBook(book) {
    return request
      .post('/api/books')
      .set('Authorization', user.token)
      .send(book)
      .expect(200)
      .then(({ body }) => body);
  }

  function addFavoriteBook(book) {
    return request
      .put(`api/me/favorites/${book.id}`)
      .set('Authorization', user.token)
      .send(user)
      .expect(200)
  }

  it('adds a book to user favorites', () => {
    console.log(user)
    return postBook(book1).then(book => {
      return request
        .put(`/api/me/favorites/${book._id}`)
        .set('Authorization', user.token)
        .send(user)
        .expect(200)
    })
    .then(({ body }) => body => {
      expect(body[0]).toEqual(book._id);
    });
  });

  it('returns list of user favorites', () => {

  })

});