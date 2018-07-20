import User from '../../support/User';
import { Model } from 'objection';
import { Authenticatable } from '../../../src/index';

describe('Authenticatable', function() {
  let user;

  beforeAll(async function() {
    user = await User.query().insert({
      name: 'Foo Bar',
      password: 'foobar',
      email: 'foo@bar.com'
    });
  });

  test('hashes the password', function() {
    expect(user.password).not.toEqual('foobar');
    expect(User.isBcryptHash(user.password)).toBe(true);
  });

  test('verifies password correctly', async function() {
    const verified = await user.verifyPassword('foobar');
    expect(verified).toBe(true);
  });

  describe('with an already hashed password', function() {
    let user2, hash;

    beforeAll(async function() {
      hash = await user.generateHash('anewhash');
      user2 = await User.query().insert({
        name: 'Foo Bar 2',
        password: hash,
        email: 'foo2@bar.com'
      });
    });

    test('does not hash the already hashed string', function() {
      expect(user2.password).toEqual(hash);
    });
  });

  describe('with strict mode on', function() {
    let hash;

    beforeAll(async function() {
      hash = await user.generateHash('helloworld');
    });

    class StrictUser extends Authenticatable({ strict: true })(Model) {
      static modelPaths = [__dirname];
      static tableName = 'users';
      static jsonSchema = {
        type: 'object',
        required: ['password'],
        properties: {
          id: { type: 'integer' },
          password: { type: 'string', minLength: 3, maxLength: 255 }
        }
      };
    }

    test('throws an error', function() {
      return expect(
        StrictUser.query().insert({ password: hash })
      ).rejects.toThrow(/bcrypt tried to hash another bcrypt hash/);
    });
  });

  describe('when updating', function() {
    let originalHash;

    beforeAll(function() {
      originalHash = user.password;
    });

    describe('and password has not changed', function() {
      beforeAll(async function() {
        await user.$query().patch({ name: 'Bar Baz' });
      });

      test('does not update the password hash', async function() {
        const verified = await user.verifyPassword('foobar');
        expect(verified).toBe(true);
        expect(user.password).toEqual(originalHash);
      });
    });

    describe('and password has changed', function() {
      beforeAll(async function() {
        await user.$query().patch({ password: 'newpass' });
      });

      test('updates the password hash', async function() {
        const verified = await user.verifyPassword('newpass');
        expect(user.password).not.toEqual('newpass');
        expect(user.password).not.toEqual(originalHash);
        expect(verified).toBe(true);
      });
    });
  });
});
