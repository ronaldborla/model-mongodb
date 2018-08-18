import { replace, snakeCase } from 'lodash';
import Key from '../key';
import Model from '../model';
import { ValidatorInterface } from '../validator';

/**
 * Field is email validator
 */
const email: ValidatorInterface = {
  message: function(model: Model, key: Key, value: any): string {
    return 'Invalid ' + replace(snakeCase(key.name), '_', ' ');
  },
  name: 'email',
  regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export default email;
