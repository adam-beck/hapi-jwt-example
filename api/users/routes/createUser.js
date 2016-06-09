'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');

function hashPassword(password, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    pre: [
      { method: verifyUniqueUser }
    ],
    validate: {
      payload: createUserSchema
    }
  },
  handler: (request, reply) => {
    let user = new User();
    user.email = request.payload.email;
    user.username = request.payload.username;
    user.admin = true;
    hashPassword(request.payload.password, (err, hash) => {
      if (err) {
        throw Boom.badRequest(err);
      }
      user.password = hash;
      user.save((err, user) => {
        if (err) {
          throw Boom.badRequest(err);
        }

        reply({ id_token: createToken(user) }).code(200);
      });
    });
  }
};
