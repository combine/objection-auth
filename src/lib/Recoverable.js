const crypto = require('crypto');

/**
 * Allows the model to be recoverable using a reset token and an expiration.
 * @param {String} opts.tokenField: The field name of the reset token.
 * @param {String} opts.tokenExpField: The field name of the reset token exp.
 * @param {Number} opts.duration: The time to expire in minutes.
 * @return {Function} A plugin mixin that accepts an Objection model as an arg.
 */

module.exports = (options = {}) => {
  const opts = Object.assign({
    tokenField: 'resetPasswordToken',
    tokenExpField: 'resetPasswordExp',
    expiresIn: 60
  }, options);

  return Model => {
    return class extends Model {
      /**
       * generateResetToken()
       * Generates a password reset token, with an expiry date
       * @return {Promise} A promises that resolves with the updated instance
       */
      generateResetToken(expiresIn = opts.expiresIn) {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(20, (err, buf) => {
            if (err) {
              reject(err);
            } else {
              const token = buf.toString('hex');
              const currTime = new Date().getTime();
              const expiration = new Date(currTime + (expiresIn * 60 * 1000));

              this[opts.tokenField] = token;
              this[opts.tokenExpField] = expiration.toISOString();

              return this
                .$query()
                .patch({
                  [opts.tokenField]: token,
                  [opts.tokenExpField]: expiration.toISOString()
                })
                .then(resolve)
                .catch(reject);
            }
          });
        });
      }
    };
  };
};
