const jwt = require('jsonwebtoken');

/**
 * Allows the specified model to be authenticated using a JSON web token.
 * @param {Objection.Model} The model class
 */
module.exports = (Model, options = {}) => {
  const opts = Object.assign({
    // expiration time in seconds (default: 7 days)
    expiresIn: 604800,

    // name of the cookie to store
    cookieName: 'jwt',

    // the secret token to use to authenticate the JWT
    secretToken: process.env.SECRET_TOKEN
  }, options);


  return class extends Model {
    /**
     * generateJWT()
     * Generates a JSON Web Token for the model
     * @param {Object} response - (optional) Response obj to set cookies with.
     * @return {Promise} A promise containing an error or the encoded token.
     */
    generateJWT = (response = null) => {
      const env = process.env.NODE_ENV || 'development';
      const currTime = new Date();
      const expiration = new Date(currTime.getTime() + opts.expiresIn * 1000);
      const expTime = expiration.getTime();
      const { id, email } = this;
      const payload = { id, email, exp: expTime * 1000 };

      if (!id || !email) {
        throw new Error(
          'The columns `id` and `email` are required to generate a JWT.'
        );
      }

      if (!opts.secretToken) {
        throw new Error('A secret must be specified to generate a JWT.');
      }

      return new Promise((resolve, reject) => {
        jwt.sign(payload, opts.secretToken, (err, token) => {
          if (err) {
            return reject(err);
          }

          // If response in arguments, set the cookie
          if (response && opts.cookieName) {
            const cookie = {
              secure: ['development', 'test'].indexOf(env) === -1,
              maxAge: expTime
            };
            response.cookie(opts.cookieName, token, cookie);
          }

          return resolve(token);
        });
      });
    }

    /**
     * decodeJWT()
     * Verifies/decodes the supplied json web token
     * @param {String} token - The token to verify
     * @return {Promise} A promise containing an error or the decoded jwt.
     */
    decodeJWT = (token) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, opts.secretToken, (err, decoded) => {
          if (err) {
            return reject(err);
          }

          return resolve(decoded);
        });
      });
    }
  };
};
