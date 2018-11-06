import { extend, replace, snakeCase } from 'lodash';
import { Key as Base, Schema } from 'javascript-model';
import Model from './model';
import Type from './type';
import Validator from './validator';
import utils from './utils';

/**
 * Key Filter
 */
export interface KeyFilter {
  callback: (value: any, key: Key, options?: Array<any>) => any;
  name?: string;
  options?: Array<any>;
}

/**
 * Key
 */
export default class Key extends Base {

  /**
   * Filters
   */
  public filters: Array<KeyFilter> = [];

  /**
   * The Type
   */
  public type: Type;

  /**
   * Validators
   */
  public validators: Array<Validator> = [];

  /**
   * Override constructor
   */
  constructor(schema: Schema, name: string, object: any) {
    super(schema, name, object);
    let filters = object.filters || object.filter || [],
        validators = object.validators || object.validator || [];
    if (!utils.isUndefined(filters) && !utils.isArray(filters)) {
      filters = [filters];
    }
    if (!utils.isUndefined(validators) && !utils.isArray(validators)) {
      validators = [validators];
    }
    this.loadFilters(filters);
    this.loadValidators(validators);
  }

  /**
   * Override cast
   */
  cast(model: Model, value: any): any {
    const length = this.filters.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        value = this.filters[i].callback.apply(model, [value, this, this.filters[i].options]);
      }
    }
    return Base.prototype.cast.apply(this, [model, value]);
  }

  /**
   * Load filters
   */
  loadFilters(filters: Array<any>): this {
    this.filters = filters.map((data: any) => {
      let filter: any = {};
      if (utils.isString(data)) {
        filter.name = data;
      } else if (utils.isFunction(data)) {
        filter.callback = data;
      } else {
        filter = data;
      }
      if (utils.isString(filter.name)) {
        const arr = filter.name.split(':');
        if (utils.isUndefined(this.schema.modeljs.filters[arr[0]])) {
          throw new this.schema.modeljs.Exception('Filter `' + arr[0] + '` is not registered');
        }
        filter = extend({}, this.schema.modeljs.filters[arr[0]], filter);
        if (!utils.isUndefined(arr[1]) && arr[1] && utils.isUndefined(filter.options)) {
          filter.options = arr[1].split(',');
        }
      }
      if (utils.isUndefined(filter.callback)) {
        throw new this.schema.modeljs.Exception('Filter must have a callback');
      }
      if (!utils.isFunction(filter.callback)) {
        throw new this.schema.modeljs.Exception('Filter callback must be a function');
      }
      if (!utils.isUndefined(filter.options) && !utils.isArray(filter.options)) {
        throw new this.schema.modeljs.Exception('Filter options must be an array');
      }
      return filter;
    });
    return this;
  }

  /**
   * Load validators
   */
  loadValidators(validators: Array<any>): this {
    this.validators = validators.map((data: any) => {
      if (data instanceof Validator) {
        return data;
      }
      let validator: any = {};
      if (utils.isString(data)) {
        validator.name = data;
      } else if (utils.isFunction(data)) {
        validator.callback = data;
      } else if (utils.isRegExp(data)) {
        validator.regex = data;
      } else if (utils.isObject(data)) {
        validator = data;
      }
      if (utils.isString(validator.name)) {
        const arr = validator.name.split(':');
        if (utils.isUndefined(this.schema.modeljs.validators[arr[0]])) {
          throw new this.schema.modeljs.Exception('Validator `' + arr[0] + '` is not registered');
        }
        validator = extend({}, this.schema.modeljs.validators[arr[0]], validator);
        if (!utils.isUndefined(arr[1]) && arr[1] && utils.isUndefined(validator.options)) {
          validator.options = arr[1].split(',');
        }
      }
      const hasCallback = !utils.isUndefined(validator.callback),
            hasRegex = !utils.isUndefined(validator.regex),
            init = validator.init;
      if (hasCallback && !utils.isFunction(validator.callback)) {
        throw new this.schema.modeljs.Exception('Validator callback must be a function');
      }
      if (hasRegex) {
        if (!utils.isRegExp(validator.regex)) {
          throw new this.schema.modeljs.Exception('Validator regex must be a regular expression');
        }
        if (this.type.Constructor !== String) {
          throw new this.schema.modeljs.Exception('Key to validate using regex must be a string');
        }
        if (utils.isUndefined(validator.message)) {
          validator.message = 'Invalid ' + replace(snakeCase(name), '_', ' ');
        }
      }
      if (!utils.isUndefined(validator.options) && !utils.isArray(validator.options)) {
        throw new this.schema.modeljs.Exception('Validator options must be an array');
      }
      if (!hasCallback && !hasRegex) {
        throw new this.schema.modeljs.Exception('Validator must have a callback or regex');
      }
      validator = new this.schema.modeljs.Validator(this, validator);
      if (utils.isFunction(init)) {
        init.apply(validator, []);
      }
      return validator;
    });
    return this;
  }

  /**
   * Validate key
   * @return Promise with resolved value or rejected error messages
   */
  validate<T>(model: Model, value: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const key = this,
            messages: Array<string> = [];
      /**
       * Queued execution of validators
       */
      function execute(index: number): void {
        if (utils.isUndefined(key.validators[index])) {
          if (messages.length > 0) {
            reject(messages);
          } else {
            resolve(value);
          }
        } else {
          key.validators[index].execute(model, value).then((resolved: T) => {
            value = resolved;
            execute(index + 1);
          }).catch((message: string) => {
            messages.push(message);
            if (key.validators[index].block === true) {
              execute(-1);
            } else {
              execute(index + 1);
            }
          });
        }
      }
      execute(0);
    });
  }
}
