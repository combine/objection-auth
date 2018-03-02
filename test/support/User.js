import { Model } from 'objection';
import { Authenticatable, Recoverable, Tokenable } from '../../index';

const AuthModel = Authenticatable(
  Recoverable(
    Tokenable(Model, { secretToken: 'secret' })
  )
);

export default class User extends AuthModel {
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
