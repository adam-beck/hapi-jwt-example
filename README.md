# Hapi JWT Example

A Hapi + JWT authentication example that uses Docker to set up all the necessary assets. It
is based heavily on the follwing article from Auth0 with a few differences.

https://auth0.com/blog/2016/03/07/hapijs-authentication-secure-your-api-with-json-web-tokens/

### Differences

The article uses [hapi-auth-jwt](https://github.com/ryanfitz/hapi-auth-jwt) but I have found there is a more secure and that is under
more active development -- [hapi-auth--jwt2](https://github.com/dwyl/hapi-auth-jwt2) from dwyl. One of the most noticeable differences is that you, as a developer, must provide the validation function. In this example, we just make sure that the request is passing a valid JWT.

### Prequisites:

  In order to get this example running you will need to have Docker and Docker Compose installed.

 - [Docker on Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntulinux/)
 - [Docker Compose](https://docs.docker.com/compose/install/)


### Running
- `docker-compose up`
- Hit Host IP address at port `8080` (e.g., `http://localhost:8080`)


### Available Routes

- **POST** /api/users
  - Use route to add user to database
  - Currently must take a JSON Object with the form:
    - <"email": STRING>
    - <"username": STRING>
    - <"password": STRING>
  - Returns a JWT
- **POST** /api/users/authenticate
  - Use route to authenticate credentials of already created user account
  - Takes a JSON Object with the form:
    - ("email": STRING | "username": STRING)
    - <"password" STRING>
  - Returns a JWT
- **GET** /api/users
  - Use route to get list of all users in system
  - Request must send a JWT with an "admin" scope in the Authorization header
    - Example => Authorization: Bearer [JWT STRING]
