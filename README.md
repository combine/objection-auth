[![Build Status](https://travis-ci.org/combine/objection-auth.svg?branch=master)](https://travis-ci.org/combine/objection-auth)
[![Coverage Status](https://coveralls.io/repos/github/combine/objection-auth/badge.svg?branch=master)](https://coveralls.io/github/combine/objection-auth?branch=master)

# Authentication for Objection.js

This package includes plugins useful for authentication for websites:

- **Authenticatable** - Generates hashed passwords for a user model. Uses `bcrypt` under the hood.
- **Recoverable** - Generates password reset tokens.
- **Tokenable** - Generates JSON Web Tokens for API authentication. Uses `jsonwebtoken` under the hood.

## Installation
```
npm install objection-auth
```

## Usage

### Authenticatable

```js
// Import the plugin.
const { Authenticatable }= require('objection-auth');
const { Model } = require('objection');

// Mixin the plugin.
const AuthenticatableModel = Authenticatable(Model, {
  passwordField: 'password',
  saltRounds: 12,
});

// Create your model.
class User extends AuthenticatableModel {
  // ...code
}
```

#### Verifying a password

In your login controller logic:

```js
const user = await User.query().where('id', 1);

if (!user.verifyPassword) {
  // throw an error
}
```

#### Options
#### `passwordField` (required)
The field to that the hashed password will be stored on. (required, defaults to 'password')

#### `saltRounds` (defaults to `slug`)
The number of salt rounds as passed to `bcrypt`.

### Recoverable

```js
// Import the plugin.
const { Recoverable }= require('objection-auth');
const { Model } = require('objection');

// Mixin the plugin.
const RecoverableModel = Recoverable(Model, {
  tokenColumn: 'resetPasswordToken',
  tokenExpColumn: 'resetPasswordExp',
  expiresIn: 3600
});

// Create your model.
class User extends RecoverableModel {
  // ...code
}
```

#### Generating a reset token

In your reset password controller logic:

```js
const user = await User.query().where('id', 1);

await user.generateResetToken();
console.log(user.resetPasswordToken);
//
```

#### Options
#### `tokenColumn` (defaults to `resetPasswordToken`)
The field that the reset token is stored on.

#### `tokenExpColumn` (defaults to `resetPasswordExp`)
The field that the expiration date is stored on.

#### `expiresIn` (defaults to `3600`)
The expiration time of the token, in seconds.


### Tokenable

```js
// Import the plugin.
const { Tokenable }= require('objection-auth');
const { Model } = require('objection');

// Mixin the plugin.
const TokenableModel = Tokenable(Model, {
  // expiration time in seconds (default: 7 days)
  expiresIn: 604800,
  // name of the cookie to store
  cookieName: 'jwt',
  // the secret token to use to authenticate the JWT
  secretToken: '!secret!'
});

// Create your model.
class User extends TokenableModel {
  // ...code
}
```

#### Generate a JWT

```js
const user = await User.query().where('id', 1);

await user.generateJWT();
```

#### Decode a JWT

```js
const user = await User.query().where('id', 1);

await user.decodeJWT();
```

#### Options
#### `expiresIn` (defaults to `604800` (7 days))
The expiration time of the json web token.

#### `cookieName` (defaults to `jwt`)
The name of the cookie to store the token on. You must pass an express-like
`response` object to `generateJWT()`.

#### `secretToken` (defaults to `process.env.SECRET_TOKEN`)
The
