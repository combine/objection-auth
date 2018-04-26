const jwt = require('jsonwebtoken');

/**
 * Allows the specified model to be authenticated using a JSON web token.
 * @param {String} opts.expiresIn - Time in seconds for the token to expire.
 * @param {String} opts.secretOrPrivateKey - A string, buffer, or object
    containing either the secret for HMAC algorithms or the PEM encoded private
    key for RSA and ECDSA.
 * @return {Function} A plugin mixin that accepts an Objection model as an arg.
 */
module.exports = (options = {}) => {
  const opts = Object.assign(
    {
      expiresIn: 10080,
      secretOrPrivateKey: null
    },
    options
  );

  if (!opts.secretOrPrivateKey) {
    throw new Error(
      'You must specify `secretOrPrivateKey`, which can be a string, or a ' +
      'buffer for a certificate file.'
    );
  }

  return Model => {
    return class extends Model {
      /**
       * generateJWT()
       * Generates a JSON Web Token for the model
       * @return {Promise} A promise containing an error or the encoded token.
       */
      generateJWT = () => {
        // convert minutes to milliseconds
        const tte = (opts.expiresIn * 60 * 1000);

        // payload expiration must be in seconds
        const exp = new Date(new Date().getTime() + tte).getTime() / 1000;

        const { id, email } = this;
        const payload = { id, email, exp };

        if (!id || !email) {
          throw new Error(
            'The columns `id` and `email` are required to generate a JWT.'
          );
        }

        return new Promise((resolve, reject) => {
          jwt.sign(payload, opts.secretOrPrivateKey, (err, token) => {
            if (err) {
              return reject(err);
            }

            return resolve(token);
          });
        });
      };

      /**
       * decodeJWT()
       * Verifies/decodes the supplied json web token
       * @param {String} token - The token to verify
       * @return {Promise} A promise containing an error or the decoded jwt.
       */
      decodeJWT = token => {
        return new Promise((resolve, reject) => {
          jwt.verify(token, opts.secretOrPrivateKey, (err, decoded) => {
            if (err) {
              return reject(err);
            }

            return resolve(decoded);
          });
        });
      };
    };
  };
};
