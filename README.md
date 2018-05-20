[![Build Status](https://travis-ci.org/combine/objection-auth.svg?branch=master)](https://travis-ci.org/combine/objection-auth)
[![Coverage Status](https://coveralls.io/repos/github/combine/objection-auth/badge.svg?branch=master)](https://coveralls.io/github/combine/objection-auth?branch=master)

# Authentication for Objection.js

This package includes plugins useful for authentication for websites:

- **Authenticatable** - Generates hashed passwords for a user model. Uses `bcrypt` under the hood.
- **Recoverable** - Generates password reset tokens.

## Installation
```
npm install objection-auth
```

## Usage

### Authenticatable

```js
// Import the plugin.
const { Authenticatable } = require('objection-auth');
const { Model } = require('objection');

// Mixin the plugin.
const AuthenticatableModel = Authenticatable({
  passwordField: 'password',
  saltRounds: 12,
})(Model);

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
const { Recoverable } = require('objection-auth');
const { Model } = require('objection');

// Mixin the plugin.
const RecoverableModel = Recoverable({
  tokenField: 'resetPasswordToken',
  tokenExpField: 'resetPasswordExp',
  expiresIn: 60
})(Model);

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
#### `tokenField` (defaults to `resetPasswordToken`)
The field that the reset token is stored on.

#### `tokenExpField` (defaults to `resetPasswordExp`)
The field that the expiration date is stored on.

#### `expiresIn` (defaults to `60` minutes)
The expiration time of the token, in minutes.

## Chaining Plugins

These plugins can be used together by composing the plugins together:

```js

const { Authenticatable, Recoverable } = require('objection-auth');
const { compose, Model } = require('objection');

const mixins = compose(
  Authenticatable({ saltRounds: 10, passwordField: 'pass' }),
  Recoverable({
    tokenField: 'resetPasswordToken',
    tokenExpField: 'resetPasswordExp',
    expiresIn: 60
  })
);

class User extends mixins(Model) {
  // ...
}
```
