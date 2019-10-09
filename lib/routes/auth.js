const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../token-service');
const ensureAuth = require('../middleware/ensure-auth');
const ensureRole = require('../middleware/ensure-role');

const sendUser = (res, user) => {
  return tokenService.sign(user)
    .then(token => {
      res.json({
        _id: user._id,
        email: user.email,
        token: token
      });
    });
};

const checkCredentialsExist = (email, password) => {
  if(!email || !password) {
    return Promise.reject({
      statusCode: 400,
      error: 'Email and password required'
    });
  }
  return Promise.resolve();
};

router
  .get('/verify', ensureAuth(), (req, res) => {
    res.json({ verified: true });
  })

  .post('/signup', (req, res, next) => {
    const { body } = req;
    const { email, password } = body;

    checkCredentialsExist(email, password)
      .then(() => {
        // check if a user already has this email
        return User.exists({ email });
      })
      .then(exists => {

        if(exists) {
          throw {
            statusCode: 400,
            error: `Email ${body.email} already in use`
          };
        }

        return User.create(req.body);
      })
      .then(user => sendUser(res, user))
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { body } = req;
    const { email, password } = body;

    checkCredentialsExist(email, password)
      .then(() => {
        return User.findOne({ email });
      })
      .then(user => {
        if(!user || !user.comparePassword(password)) {
          throw {
            statusCode: 401,
            error: 'Invalid email or password'
          };
        }

        return sendUser(res, user);
      })
      .catch(next);
  })

  .put('/users/:id/roles/:role', ensureAuth(), ensureRole('admin'), ({ user, params }, res, next) => {
    User.updateById(params.id, {
      $addToSet: {
        roles: params.role
      }
    })
    .then(updatedUser => {
      return res.json(updatedUser)
    })
    .catch(next);
  });

module.exports = router;