const crypto = require('crypto');

/**
 * Allows the model to be recoverable using a reset token and an expiration.
 * @param {Model} The model to decorate. Usually Object.Model.
 * @param {String} opts.tokenColumn: The column name of the reset token.
 * @param {String} opts.tokenExpColumn: The column name of the reset token exp.
 * @param {String} opts.duration: The time to expire in seconds (default: 3600)
 */

module.exports = (Model, options = {}) => {
  const opts = Object.assign({
    tokenColumn: 'resetPasswordToken',
    tokenExpColumn: 'resetPasswordExp',
    expiresIn: 3600
  }, options);

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
            const expiration = new Date(currTime + (expiresIn * 1000));

            this[opts.tokenColumn] = token;
            this[opts.tokenExpColumn] = expiration.toISOString();

            return this
              .$query()
              .patch({
                [opts.tokenColumn]: token,
                [opts.tokenExpColumn]: expiration.toISOString()
              })
              .then(resolve)
              .catch(reject);
          }
        });
      });
    }
  };
};
