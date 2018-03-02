import expect from 'expect';
import User from '../../support/User';

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
