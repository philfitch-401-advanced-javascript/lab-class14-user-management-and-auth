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
      .put(`/api/me/favorites/${book._id}`)
      .set('Authorization', user.token)
      .expect(200)
      .then(({ body }) => body);
  }

  it('adds a book to user favorites', () => {
    return postBook(book1)
      .then(book => {
      return addFavoriteBook(book)
      .then(body => {
        expect(body.favorites[0]).toEqual(book._id);
      });
    })
  });

  it('returns list of user favorites', () => {
    return Promise.all([
      postBook({ title: 'book 1', author: 'Author', year: 2019 }),
      postBook({ title: 'book 2', author: 'Author', year: 2019 }),
      postBook({ title: 'book 3', author: 'Author', year: 2019 })
    ])
    .then(body => {
      return Promise.all([
        addFavoriteBook(body[0]),
        addFavoriteBook(body[1]),
        addFavoriteBook(body[2]),
        ])
      })
    .then(() => {
      return request
        .get(`/api/me/favorites`)
        .set('Authorization', user.token)
        .expect(200);
      })
    .then(({ body }) => {
      expect(body.length).toEqual(3);
    })
  })

  it('deletes a book from favorites', () => {
    return postBook(book1)
    .then(body => {
      return addFavoriteBook(body)
      .then((updatedUser) => {
        expect(updatedUser.favorites[0]).toEqual(body._id)
        return request
          .delete(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(user.favorites).toEqual([]);
      })
    })
  })

});