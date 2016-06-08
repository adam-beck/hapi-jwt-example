'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');
// const jwt = require('jsonwebtoken');

const server = new Hapi.Server();

server.connection({ port: 3000 });

const dbUrl = 'mongodb://localhost:3001/hapi-app';

function validate(decoded, request, callback) {
  console.log('in validate function');
  console.log(decoded);
  if (decoded) {
    return callback(null, true, decoded);
  }

  return callback(null, false);
}

server.register(require('hapi-auth-jwt2'), err => {

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: validate,
    verifyOptions: { alogorithms: ['HS256'] }
  });

  glob.sync('api/**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });

});

server.start(err => {
  if (err) {
    throw err;
  }

  mongoose.connect(dbUrl, {}, err => {
    if (err) {
      throw err;
    }

    console.log('all up and ready');
  });
});
