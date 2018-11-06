import { isUndefined } from 'lodash';

import Key, { KeyFilter } from '../key';

/**
 * Lowercase filter
 * Trims only whitespaces
 */
const lower: KeyFilter = {
  callback: (value: any, key: Key, options?: Array<any>): any => {
    if (!isUndefined(value) && value !== null) {
      value = (value + '').toLowerCase();
    }
    return value;
  },
  name: 'lower'
};

export default lower;
