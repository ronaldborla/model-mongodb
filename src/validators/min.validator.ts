import Key from '../key';
import utils from '../utils';
import { ValidatorInterface } from '../validator';

/**
 * Min field
 */
const min: ValidatorInterface = {
  callback: function(value: any, key: Key, options: Array<string>): boolean {
    return value >= parseFloat(options[0]);
  },
  init: function() {
    if (utils.isUndefined(this.options) || !utils.isArray(this.options) || utils.isUndefined(this.options[0])) {
      throw new this.key.schema.modeljs.Exception('Missing or invalid `min` value for key `' + this.key.name + '`');
    }
  },
  message: function(value: any, key: Key, options: Array<string>): string {
    return 'Value cannot be less than ' + options[0];
  },
  name: 'min'
};

export default min;
