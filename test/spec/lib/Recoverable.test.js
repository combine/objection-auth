import expect from 'expect';
import sinon from 'sinon';
import User from '../../support/User';

describe('Recoverable', function() {
  describe('.generateResetToken', function() {
    let user, currTime;

    beforeAll(async function() {
      currTime = new Date();
      sinon.useFakeTimers(currTime);
      user = await User.query().insert({
        name: 'Foo Bar',
        password: 'foobar',
        email: 'foo@bar.com'
      });
    });

    test('exists as a function', function() {
      expect(user.generateResetToken).toBeDefined();
      expect(user.generateResetToken).toBeInstanceOf(Function);
    });

    test('saves a reset token on the user', async function() {
      await user.generateResetToken();

      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordToken).not.toEqual(null);
    });

    test('sets the expiration date to the specified time', async function() {
      await user.generateResetToken(7200);
      const exp = new Date(currTime.getTime() + (7200 * 1000));

      expect(user.resetPasswordExp).toEqual(exp.toISOString());
    });
  });
});
