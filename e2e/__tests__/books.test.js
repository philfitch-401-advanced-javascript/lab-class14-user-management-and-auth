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

  function postBook(book) {
    return request
      .post('/api/books')
      .set('Authorization', user.token)
      .send(book)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a book for this user', () => {
    return postBook(book).then(book => {
      expect(book.owner).toBe(user._id);
      expect(book).toMatchInlineSnapshot(
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

  it('gets a list of books', () => {
    const firstBook = {
      title: 'book 1',
      author: 'Author',
      year: 2019
    };
    return Promise.all([
      postBook(firstBook),
      postBook({ title: 'book 2', author: 'Author', year: 2019 }),
      postBook({ title: 'book 3', author: 'Author', year: 2019 })
    ])
      .then(() => {
        return request.get('/api/books').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          author: 'Author',
          title: firstBook.title,
          year: firstBook.year
        });
      });
  });

  it('gets a book by id', () => {
    return postBook(book)
      .then(book => {
        return request.get(`/api/books/${book._id}`).expect(200);
      })
      .then(({ body }) => {
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

  it('deletes a book', () => {
    return postBook(book).then(book => {
      return request
        .delete(`/api/books/${book._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });

  it("doesn't delete if no authorization", () => {
    return postBook(book).then(book => {
      return request.delete(`/api/books/${book.id}`).expect(401);
    });
  });

  it('owner can update a book', () => {
    return postBook(book).then(book => {
      book.year = 2020
      return request
        .put(`/api/books/${book._id}`)
        .send(book)
        .set('Authorization', user.token)
        .expect(200)
      })
      .then(({ body }) => {
        expect(body.year).toBe(2020);
      })
  })

  it('non-owner cannot update a book', () => {
    return postBook(book).then(book => {
      book.year = 2020
      return request
        .put(`/api/books/${book._id}`)
        .send(book)
        .expect(401)
      })
  })

});
