const bcrypt = require('bcrypt');

module.exports = (Model, options) => {
  // Provide some default options
  const opts = Object.assign({
    // The password field column
    passwordField: 'password',

    // How many salt rounds to for salt generation
    saltRounds: 12,

  }, options);

  return class extends Model {
    $beforeInsert(context) {
      const maybePromise = super.$beforeInsert(context);

      return Promise.resolve(maybePromise).then(() => {
        return this.generateHash(this[opts.passwordField]).then(hash => {
          this[opts.passwordField] = hash;
        });
      });
    }

    $beforeUpdate(queryOptions, context) {
      const maybePromise = super.$beforeUpdate(queryOptions, context);

      return Promise.resolve(maybePromise).then(() => {
        const password = this[opts.passwordField];

        if (password) {
          return this.generateHash(this[opts.passwordField]).then(hash => {
            this[opts.passwordField] = hash;
          });
        }

        return Promise.resolve();
      });
    }

    /**
     * Compares a password to a Bcrypt hash
     * @param {String} password - The plaintext password to check
     * @return {Boolean} Whether password is verified or not
     */
    verifyPassword(password) {
      return bcrypt.compare(password, this[opts.passwordField]);
    }

    /**
     * Generates a Bcrypt hash
     * @param {String} password - The plaintext password to hash
     * @return {String} The hash or null
     */
    generateHash = (password) => {
      if (password) {
        if (this.constructor.isBcryptHash(password)) {
          throw new Error('bcrypt tried to hash another bcrypt hash');
        }

        return bcrypt.hash(password, opts.saltRounds).then(hash => {
          return hash;
        });
      }

      return Promise.resolve();
    }

    /**
     * Detect rehashing for avoiding undesired effects
     * @param {String} str A string to be checked
     * @return {Boolean} True if the str seems to be a bcrypt hash
     */
    static isBcryptHash(str) {
      const protocol = str.split('$');

      // Ex $2a$12$K2CtDP7zSGOKgjXjxD9SYey9mSZ9Udio9C95K6wCKZewSP9oBWyPO
      return (
        protocol.length === 4 &&
        protocol[0] === '' &&
        ['2a', '2b', '2y'].indexOf(protocol[1]) > -1 &&
        /^\d+$/.test(protocol[2]) &&
        protocol[3].length === 53
      );
    }
  };
};
