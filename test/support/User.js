import { Model } from 'objection';
import { Authenticatable, Recoverable } from '../../src/index';

const Auth = Authenticatable({});
const Recover = Recoverable();

export default class User extends Recover(Auth(Model)) {
  static modelPaths = [__dirname];
  static tableName = 'users';
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'password'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 3, maxLength: 255 },
      password: { type: 'string', minLength: 3, maxLength: 255 },
      resetPasswordToken: { type: 'string', minLength: 20, maxLength: 255 },
      resetPasswordExp: { type: 'string', format: 'date-time' }
    }
  };
}
