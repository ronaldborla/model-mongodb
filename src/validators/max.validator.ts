import Key from '../key';
import utils from '../utils';
import { ValidatorInterface } from '../validator';

/**
 * Max field
 */
const max: ValidatorInterface = {
  callback: function(value: any, key: Key, options: Array<string>): boolean {
    return value <= parseFloat(options[0]);
  },
  init: function() {
    if (utils.isUndefined(this.options) || !utils.isArray(this.options) || utils.isUndefined(this.options[0])) {
      throw new this.key.schema.modeljs.Exception('Missing or invalid `max` value for key `' + this.key.name + '`');
    }
  },
  message: function(value: any, key: Key, options: Array<string>): string {
    return 'Value cannot be greater than ' + options[0];
  },
  name: 'max'
};

export default max;
