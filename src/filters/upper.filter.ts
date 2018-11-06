import { isUndefined } from 'lodash';

import Key, { KeyFilter } from '../key';

/**
 * Uppercase filter
 * Trims only whitespaces
 */
const upper: KeyFilter = {
  callback: (value: any, key: Key, options?: Array<any>): any => {
    if (!isUndefined(value) && value !== null) {
      value = (value + '').toUpperCase();
    }
    return value;
  },
  name: 'upper'
};

export default upper;
