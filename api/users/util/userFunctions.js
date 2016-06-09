'use strict';

const Boom = require('boom');
const User = require('../model/User');

function verifyUniqueUser(request, reply) {

  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, (err, user) => {

    if (user) {
      if (user.username === request.payload.username) {
        return reply(Boom.badRequest('Username taken'));
      }

      if (user.email === request.payload.email) {
        return reply(Boom.badRequest('Email taken'));
      }
    }

    // if everything checks out, send the payload through
    // to the route handler
    return reply(request.payload);
  });
}

function verifyCredentials(request, reply) {

  const password = request.payload.password;

  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, (err, user) => {

    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          return reply(user);
        }

        return reply(Boom.badRequest('Incorrect password!'));
      });
    }

    return reply(Boom.badRequest('Incorrect username or email'));

  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials
};
