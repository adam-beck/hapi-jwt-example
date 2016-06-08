'use strict';

const Boom = require('boom');
const User = require('../model/User');

function verifyUniqueUser(req, res) {

  User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {

    if (user) {
      if (user.username === req.payload.username) {
        return res(Boom.badRequest('Username taken'));
      }

      if (user.email === req.payload.email) {
        return res(Boom.badRequest('Email taken'));
      }
    }

    // if everything checks out, send the payload through
    // to the route handler
    return res(req.payload);
  });
}

function verifyCredentials(req, res) {

  const password = req.payload.password;

  User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {

    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          return res(user);
        }

        return res(Boom.badRequest('Incorrect password!'));
      });
    }

    return res(Boom.badRequest('Incorrect username or email'));

  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials
};
