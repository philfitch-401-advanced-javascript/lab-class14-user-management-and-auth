const Book = require('../books');

describe('Book Model', () => {

  it('valid book model', () => {
    
    const data = {
      title: 'Moby Dick',
      author: 'Herman Melville',
      year: 1851,
    }

    const book = new Book(data);

    expect(book.title).toBe(data.title);
    expect(book.author).toBe(data.author);
    expect(book.year).toBe(data.year);
    expect(book.owner).toBe(undefined);
  });
});