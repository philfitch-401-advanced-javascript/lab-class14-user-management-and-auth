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

  .get('/', (req , res, next) => {
    
    Book.find()
      .select('title author year')
      .lean()
      .then(books => {
        res.json(books);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Book.findById(req.params.id)
    .lean()
    .then(book => res.json(book))
    .catch(next);
  })

  .put('/:id', ensureAuth(), ({ params, body, user}, res, next) => {
    Book.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
    .then(book => res.json(book))
    .catch(next);
  })

  .delete('/:id', ensureAuth(), ({ params, user }, res, next) => {
    Book.findOneAndRemove({
      _id: params.id,
      owner: user._id
    })
      .then(book => res.json(book))
      .catch(next);
  });

module.exports = router;