'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/api/users',
  config: {
    auth: {
      strategy: 'jwt',
      access: {
        scope: ['admin']
      }
    }
  },
  handler: (request, reply) => {
      User
        .find()
        .select('-password -__v')
        .exec((err, users) => {
          if (err) {
            throw Boom.badRequest(err);
          }

          if (!users.length) {
            throw Boom.notFound('No users found!');
          }

          reply(users);
        });
  }
};
