import { extend } from 'lodash';
import { Model as Base } from 'javascript-model';
import {
  Db,
  Collection as MongoCollection,
  CommonOptions,
  DeleteWriteOpResultObject,
  FilterQuery,
  FindOneOptions,
  InsertOneWriteOpResult,
  MongoError,
  UpdateWriteOpResult
} from 'mongodb';
import Collection from './collection';
import Key from './key';
import Schema from './schema';
import utils from './utils';
import { TypeConfig } from './type';
import { ValidationResult } from './validator';

import Id from './types/id.type';

/**
 * Get collection
 */
function collection(model: Model): MongoCollection {
  return db(model).collection((model.constructor as typeof Model).Collection.collection);
}

/**
 * Get db
 */
function db(model: Model): Db {
  return schema(model).modeljs.db;
}

/**
 * Id
 */
function id(model: Model): Key {
  return schema(model).cache.index.id;
}

/**
 * Get schema
 */
function schema(model: Model): Schema {
  return (model.constructor as typeof Model).schema;
}

/**
 * Set ID
 */
function setId(model: Model, data?: any): Model {
  const primary = id(model);
  if (data) {
    if (Id.isValid(data)) {
      model[primary.name] = data;
    } else if (!utils.isUndefined(data._id) && primary.name !== '_id') {
      model[primary.name] = data._id;
    }
  }
  return model;
}

/**
 * Delete options
 */
export interface DeleteOptions extends CommonOptions {}

/**
 * Reload options
 */
export interface ReloadOptions {
  findOptions?: FindOneOptions;
  depth?: number;
}

/**
 * Save options
 */
export interface SaveOptions {
  depth?: number;
}

/**
 * Validate options
 */
export interface ValidateOptions {
  depth?: number;
}

/**
 * Model
 */
export default class Model extends Base {

  /**
   * Override constructor
   */
  constructor(data?: any) {
    super(data);
    setId(this, data);
  }

  /**
   * Create Model and save to database
   * @return Promise
   */
  static create(data: any, options?: SaveOptions): Promise<Model> {
    return (new this(data)).save(options);
  }

  /**
   * Find document
   */
  static find(query?: FilterQuery<any>, options?: FindOneOptions, reloadOptions?: ReloadOptions): Promise<Model> {
    return (this.schema.modeljs.db as Db).collection(this.Collection.collection).findOne(query || {}, options).then((data: any) => {
      return new this(data);
    }).then((model: Model) => {
      return utils.isUndefined(reloadOptions) ? model : model.reload(reloadOptions);
    });
  }

  /**
   * Delete one
   */
  delete(options?: DeleteOptions): Promise<null> {
    const key = this[id(this).name];
    if (!key) {
      return Promise.reject('`' + schema(this).cache.index.id.name + '` is undefined');
    }
    return utils.hook(this, 'beforeDelete').then(() => {
      return new Promise((resolve, reject) => {
        collection(this).deleteOne({ _id: key }, options, (error: MongoError, result: DeleteWriteOpResultObject) => {
          if (!error) {
            resolve(null);
          } else {
            reject(error);
          }
        });
      });
    }).then(() => {
      return utils.hook(this, 'afterDelete').then(() => {
        return null;
      });
    });
  }

  /**
   * Override load
   */
  load(data?: any): this {
    Base.prototype.load.apply(this, [data]);
    setId(this, data);
    return this;
  }

  /**
   * Reload data
   * @param Reload options
   * @return Promise with model
   */
  reload(options?: ReloadOptions): Promise<this> {
    const depth = (options || {}).depth || 0,
          findOptions = (options || {}).findOptions || {},
          key = this[id(this).name];
    if (!key) {
      return Promise.reject('`' + schema(this).cache.index.id.name + '` is undefined');
    }
    return utils.hook(this, 'beforeReload').then(() => {
      return collection(this).findOne({ _id: key }, findOptions).then((data: any) => {
        const promises = [];
        schema(this).keys.forEach((key: Key) => {
          if (!utils.isUndefined(data[key.name])) {
            this[key.name] = data[key.name];
            if ((key.type.Constructor.isModel === true || key.type.Constructor.isCollection === true) && depth > 0) {
              promises.push(this[key.name].reload(extend({}, options, {
                depth: depth - 1
              })).then((child: any) => {
                this[key.name] = child;
              }));
            }
          }
        });
        return Promise.all(promises).then(() => {
          return this;
        });
      });
    }).then(() => {
      return utils.hook(this, 'afterReload');
    });
  }

  /**
   * Save data
   * @param Save options
   * @return Promise with saved model
   */
  save(options?: SaveOptions): Promise<this> {
    const data = {},
          depth = (options || {}).depth || 0,
          names = [],
          primary = id(this),
          primary_id = this[primary.name] as Id,
          promises = [],
          insert = utils.isUndefined(primary_id);
    return utils.hook(this, [(insert ? 'beforeInsert' : 'beforeUpdate'), 'beforeSave']).then(() => {
      schema(this).keys.forEach((key: Key) => {
        if (key.name === primary.name) {
          return true;
        }
        let value = this[key.name],
            config = key.type.Constructor.typeConfig,
            isTypeConfig = config instanceof TypeConfig;
        if (utils.isUndefined(value) && isTypeConfig && !utils.isUndefined(config.default)) {
          value = key.cast(this, utils.isFunction(config.default) ? config.default() : config.default);
        }
        if (!utils.isUndefined(value) && isTypeConfig) {
          if (!utils.isUndefined(config[insert ? 'insert' : 'update'])) {
            value = value[config[insert ? 'insert' : 'update']]();
          } else if (!utils.isUndefined(config.save)) {
            value = value[config.save]();
          }
        }
        if (utils.isUndefined(value)) {
          return true;
        }
        if (key.type.Constructor.isModel === true) {
          if (depth > 0) {
            promises.push((value as Model).save(extend({}, options, {
              depth: depth - 1
            })).then((child: Model) => {
              const child_id = child[id(child).name];
              if (!utils.isUndefined(child_id)) {
                data[key.name] = child_id;
              }
            }));
          } else {
            const child_id = (value as Model)[id(value as Model).name];
            if (!utils.isUndefined(child_id)) {
              data[key.name] = child_id;
            }
          }
        } else if (key.type.Constructor.isCollection === true) {
          if (depth > 0) {
            promises.push((value as Collection).save(extend({}, options, {
              depth: depth - 1
            })).then((children: Collection) => {
              const children_ids = [];
              children.forEach((child: Model) => {
                const child_id = child[id(child).name];
                if (!utils.isUndefined(child_id)) {
                  children_ids.push(child_id);
                }
              });
              if (children_ids.length > 0) {
                data[key.name] = children_ids;
              }
            }));
          } else {
            const children_ids = [];
            (value as Collection).forEach((child: Model) => {
              const child_id = child[id(child).name];
              if (!utils.isUndefined(child_id)) {
                children_ids.push(child_id);
              }
            });
            if (children_ids.length > 0) {
              data[key.name] = children_ids;
            }
          }
        } else {
          promises.push(utils.when(value).then((final: any) => {
            if (!utils.isUndefined(final)) {
              data[key.name] = final;
            }
          }));
        }
      });
      return Promise.all(promises).then(() => {
        if (insert) {
          return collection(this).insertOne(data).then((result: InsertOneWriteOpResult) => {
            this[primary.name] = result.insertedId;
            return this;
          });
        } else {
          return collection(this).updateOne({
            _id: primary_id
          }, {
            $set: data
          }).then((result: UpdateWriteOpResult) => {
            if (result.modifiedCount === 0) {
              const Exception = schema(this).modeljs.Exception;
              throw new Exception('Document with `' + primary.name + '` `' + primary_id.toHexString() + '` does not exist');
            }
            return this;
          });
        }
      });
    }).then(() => {
      return utils.hook(this, ['afterSave', (insert ? 'afterInsert' : 'afterUpdate')]);
    });
  }

  /**
   * Validate
   * @return Always return a resolved array of ValidationResult
   * Rejected values are critical errors
   */
  validate(options?: ValidateOptions): Promise<Array<ValidationResult>> {
    const depth = (options || {}).depth || 0,
          promises = [],
          Result = schema(this).modeljs.ValidationResult;
    return utils.hook(this, 'beforeValidate').then(() => {
      schema(this).keys.forEach((key: Key) => {
        let value = this[key.name],
            config = key.type.Constructor.typeConfig;
        if (value && config instanceof TypeConfig && !utils.isUndefined(config.validate)) {
          value = value[config.validate]();
        }
        if (!utils.isUndefined(value)) {
          promises.push((new Promise((resolve) => {
            const result: ValidationResult = new Result({
              key: key,
              value: value
            });
            key.validate(this, value).then(() => {
              resolve(result);
            }).catch((messages: Array<string>) => {
              result.messages = messages;
              resolve(result);
            });
          })).then((result: ValidationResult) => {
            if (depth > 0 && value instanceof Model) {
              return new Promise((resolve) => {
                (value as Model).validate(extend({}, options, {
                  depth: depth - 1
                })).then((child: Array<ValidationResult>) => {
                  result.child = child;
                  resolve(result);
                })
              });
            } else if (depth > 0 && value instanceof Collection) {
              return new Promise((resolve) => {
                (value as Collection).validate(extend({}, options, {
                  depth: depth - 1
                })).then((child: Array<Array<ValidationResult>>) => {
                  result.child = child;
                  resolve(result);
                })
              });
            } else {
              return result;
            }
          }));
        }
      });
      return Promise.all(promises);
    }).then((validationResults: Array<ValidationResult>) => {
      return utils.hook(this, 'afterValidate').then(() => {
        return validationResults;
      });
    });
  }
}
