import { replace, snakeCase, trim, upperFirst } from 'lodash';
import Key from '../key';
import Model from '../model';
import utils from '../utils';
import { ValidatorInterface } from '../validator';

/**
 * Field is required validator
 */
const required: ValidatorInterface = {
  callback: function(value: any, key: Key): boolean {
    if (value === null) {
      return false;
    }
    if (utils.isString(value) && trim(value) === '') {
      return false;
    }
    return true;
  },
  message: function(value: any, key: Key): string {
    return upperFirst(replace(snakeCase(key.name), '_', ' ')) + ' is required';
  },
  name: 'required'
};

export default required;
