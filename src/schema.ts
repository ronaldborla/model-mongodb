import { snakeCase } from 'lodash';
import { Schema as Base } from 'javascript-model';
import Key from './key';
import utils from './utils';

import Id from './types/id.type';

/**
 * Schema
 */
export default class Schema extends Base {

  constructor(modeljs: any, model: any) {
    super(modeljs, model);
    this.cache.collection = {
      name: snakeCase((this.Model as any).Collection.name)
    };
    this.cache.index.id = null;
    this.keys.forEach((key: Key) => {
      if (utils.inherits(key.type.Constructor, Id)) {
        if (this.cache.index.id !== null) {
          throw new this.modeljs.Exception('Models cannot have more than 1 ObjectId');
        }
        this.cache.index.id = key;
      }
    });
    if (this.cache.index.id === null) {
      this.keys.unshift(new this.modeljs.Key(this, '_id', {
        hidden: true,
        type: 'Id'
      }));
      this.cache.index.id = this.keys[0];
    }
  }
}
