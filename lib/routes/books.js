/* eslint-disable new-cap */
const router = require('express').Router();
const Book = require('../models/book');
const ensureAuth = require('../middleware/ensure-auth');

router

  .post('/', ensureAuth(), (req, res, next) => {
    req.body.owner = req.user.id;

    Book.create(req.body)
     .then(book => res.json(book))
     .catch(next);
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.title) findQuery.title = query.title;
    if(query.author) findQuery.author = query.author;

    Book.find(findQuery)
      .select('title author year')
      .lean()
      .then(books => {
        res.json(books);
      })
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    req.body.owner = req.user.id;

    Book.findByIdAndRemove(req.params.id)
      .then(book => res.json(book))
      .catch(next);
  });

module.exports = router;