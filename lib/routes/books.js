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

module.exports = router;