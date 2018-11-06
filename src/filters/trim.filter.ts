import { isUndefined, trim, trimEnd, trimStart } from 'lodash';

import Key, { KeyFilter } from '../key';

/**
 * Trim filter
 * Trims only whitespaces
 */
const trimFilter: KeyFilter = {
  callback: (value: any, key: Key, options?: Array<any>): any => {
    if (!isUndefined(value) && value !== null) {
      if (!isUndefined(options) && !isUndefined(options[0])) {
        if (options[0] === 'start') {
          value = trimStart(value + '');
        } else if (options[0] === 'end') {
          value = trimEnd(value + '');
        } else {
          throw new key.schema.modeljs.Exception('Invalid trim option: ' + options[0]);
        }
      } else {
        value = trim(value + '');
      }
    }
    return value;
  },
  name: 'trim'
};

export default trimFilter;
