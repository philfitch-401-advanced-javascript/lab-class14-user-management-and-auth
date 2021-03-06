/* eslint-disable new-cap */
const router = require('express').Router();
const User = require('../models/user');
const ensureAuth = require('../middleware/ensure-auth');

router
  .get('/favorites', ensureAuth(), ({ user }, res, next) => {
    User.findById(user.id)
      .populate('favorites', 'name')
      .lean()
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .put('/favorites/:bookId', ensureAuth(), ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $addToSet: {
        favorites: params.bookId
      }
    })
      .then(favorites => {
        return res.json(favorites)
      })
      .catch(next);
  })

  .delete('/favorites/:bookId', ensureAuth(), ({ user, params }, res, next) => {
    User.removeBook(user.id, params.bookId)
      .then(favorites => res.json(favorites))
      .catch(next);
  });

module.exports = router;