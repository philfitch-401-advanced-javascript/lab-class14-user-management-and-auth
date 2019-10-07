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
      .put(`/api/me/favorites/${book.id}`)
      .set('Authorization', user.token)
      .expect(200)
  }

  it('adds a book to user favorites', () => {
    return postBook(book1).then(book => {
      return request
        .put(`/api/me/favorites/${book._id}`)
        .set('Authorization', user.token)
        .expect(200)
    })
    .then(({ body }) => body => {
      expect(body[0]).toEqual(book._id);
    });
  });

  it.skip('returns list of user favorites', () => {
    return Promise.all([
      postBook({ title: 'book 1', author: 'Author', year: 2019 }),
      postBook({ title: 'book 2', author: 'Author', year: 2019 }),
      postBook({ title: 'book 3', author: 'Author', year: 2019 })
    ])
    // .then(() => {
    //   return request.get('/api/books').expect(200)
    // })
    .then(({ body }) => body => {
      console.log(body)
      return request
        .put(`/api/me/favorites/${body[0]._id}`)
        .set('Authorization', user.token)
        .expect(200)
      })
    .then(() => {
      return request
        .get(`/api/me/favorites`).expect(200)
        .set('Authorization', user.token);
      })
    .then(({ body }) => {
      console.log(body)
      expect(body.length).toEqual(3);
    })
  })

  
});