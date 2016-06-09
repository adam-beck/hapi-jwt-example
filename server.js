'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');

const server = new Hapi.Server();

server.connection({ port: 80 });

const dbUrl = 'mongodb://db:27017/hapi-app';

function validate(decoded, request, callback) {
  // if the user has a valid JWT then he/she has already been sucessfully authenticated
  // so there isn't much reason for any further validation
  // this validate function just checks that the user has a valid JWT and passes it on
  return callback(null, !!decoded);
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

    console.log(`Server up and running at: ${server.info.uri}`);
  });
});
