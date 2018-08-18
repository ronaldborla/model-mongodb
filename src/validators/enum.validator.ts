import { replace, snakeCase } from 'lodash';
import Key from '../key';
import utils from '../utils';
import { ValidatorInterface } from '../validator';

/**
 * Enum field
 */
const enumv: ValidatorInterface = {
  callback: function(value: any, key: Key, options: Array<string>): boolean {
    return options.indexOf(value) >= 0;
  },
  init: function() {
    if (utils.isUndefined(this.options) || !utils.isArray(this.options) || !this.options.length) {
      throw new this.key.schema.modeljs.Exception('Missing or invalid enum options for key `' + this.key.name + '`');
    }
  },
  message: function(value: any, key: Key, options: Array<string>): string {
    return 'Invalid ' + replace(snakeCase(key.name), '_', ' ') + ': ' + value;
  },
  name: 'enum'
};

export default enumv;
