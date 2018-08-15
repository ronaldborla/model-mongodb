"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const javascript_model_1 = require("javascript-model");
const collection_1 = require("./collection");
const utils_1 = require("./utils");
const type_1 = require("./type");
const id_type_1 = require("./types/id.type");
/**
 * Get collection
 */
function collection(model) {
    return db(model).collection(model.constructor.Collection.collection);
}
/**
 * Get db
 */
function db(model) {
    return schema(model).modeljs.db;
}
/**
 * Id
 */
function id(model) {
    return schema(model).cache.index.id;
}
/**
 * Get schema
 */
function schema(model) {
    return model.constructor.schema;
}
/**
 * Set ID
 */
function setId(model, data) {
    const primary = id(model);
    if (data) {
        if (id_type_1.default.isValid(data)) {
            model[primary.name] = data;
        }
        else if (!utils_1.default.isUndefined(data._id) && primary.name !== '_id') {
            model[primary.name] = data._id;
        }
    }
    return model;
}
/**
 * Model
 */
class Model extends javascript_model_1.Model {
    /**
     * Override constructor
     */
    constructor(data) {
        super(data);
        setId(this, data);
    }
    /**
     * Create Model and save to database
     * @return Promise
     */
    static create(data, options) {
        return (new this(data)).save(options);
    }
    /**
     * Find document
     */
    static find(query, options, reloadOptions) {
        return this.schema.modeljs.db.collection(this.Collection.collection).findOne(query || {}, options).then((data) => {
            return new this(data);
        }).then((model) => {
            return utils_1.default.isUndefined(reloadOptions) ? model : model.reload(reloadOptions);
        });
    }
    /**
     * Delete one
     */
    delete(options) {
        const key = this[id(this).name];
        if (!key) {
            return Promise.reject('`' + schema(this).cache.index.id.name + '` is undefined');
        }
        return utils_1.default.hook(this, 'beforeDelete').then(() => {
            return new Promise((resolve, reject) => {
                collection(this).deleteOne({ _id: key }, options, (error, result) => {
                    if (!error) {
                        resolve(null);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }).then(() => {
            return utils_1.default.hook(this, 'afterDelete').then(() => {
                return null;
            });
        });
    }
    /**
     * Override load
     */
    load(data) {
        javascript_model_1.Model.prototype.load.apply(this, [data]);
        setId(this, data);
        return this;
    }
    /**
     * Reload data
     * @param Reload options
     * @return Promise with model
     */
    reload(options) {
        const depth = (options || {}).depth || 0, findOptions = (options || {}).findOptions || {}, key = this[id(this).name];
        if (!key) {
            return Promise.reject('`' + schema(this).cache.index.id.name + '` is undefined');
        }
        return utils_1.default.hook(this, 'beforeReload').then(() => {
            return collection(this).findOne({ _id: key }, findOptions).then((data) => {
                const promises = [];
                schema(this).keys.forEach((key) => {
                    if (!utils_1.default.isUndefined(data[key.name])) {
                        this[key.name] = data[key.name];
                        if ((key.type.Constructor.isModel === true || key.type.Constructor.isCollection === true) && depth > 0) {
                            promises.push(this[key.name].reload(lodash_1.extend({}, options, {
                                depth: depth - 1
                            })).then((child) => {
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
            return utils_1.default.hook(this, 'afterReload');
        });
    }
    /**
     * Save data
     * @param Save options
     * @return Promise with saved model
     */
    save(options) {
        const data = {}, depth = (options || {}).depth || 0, names = [], primary = id(this), primary_id = this[primary.name], promises = [], insert = utils_1.default.isUndefined(primary_id);
        return utils_1.default.hook(this, [(insert ? 'beforeInsert' : 'beforeUpdate'), 'beforeSave']).then(() => {
            schema(this).keys.forEach((key) => {
                if (key.name === primary.name) {
                    return true;
                }
                let value = this[key.name], config = key.type.Constructor.typeConfig, isTypeConfig = config instanceof type_1.TypeConfig;
                if (utils_1.default.isUndefined(value) && isTypeConfig && !utils_1.default.isUndefined(config.default)) {
                    value = key.cast(this, utils_1.default.isFunction(config.default) ? config.default() : config.default);
                }
                if (!utils_1.default.isUndefined(value) && isTypeConfig) {
                    if (!utils_1.default.isUndefined(config[insert ? 'insert' : 'update'])) {
                        value = value[config[insert ? 'insert' : 'update']]();
                    }
                    else if (!utils_1.default.isUndefined(config.save)) {
                        value = value[config.save]();
                    }
                }
                if (utils_1.default.isUndefined(value)) {
                    return true;
                }
                if (key.type.Constructor.isModel === true) {
                    if (depth > 0) {
                        promises.push(value.save(lodash_1.extend({}, options, {
                            depth: depth - 1
                        })).then((child) => {
                            const child_id = child[id(child).name];
                            if (!utils_1.default.isUndefined(child_id)) {
                                data[key.name] = child_id;
                            }
                        }));
                    }
                    else {
                        const child_id = value[id(value).name];
                        if (!utils_1.default.isUndefined(child_id)) {
                            data[key.name] = child_id;
                        }
                    }
                }
                else if (key.type.Constructor.isCollection === true) {
                    if (depth > 0) {
                        promises.push(value.save(lodash_1.extend({}, options, {
                            depth: depth - 1
                        })).then((children) => {
                            const children_ids = [];
                            children.forEach((child) => {
                                const child_id = child[id(child).name];
                                if (!utils_1.default.isUndefined(child_id)) {
                                    children_ids.push(child_id);
                                }
                            });
                            if (children_ids.length > 0) {
                                data[key.name] = children_ids;
                            }
                        }));
                    }
                    else {
                        const children_ids = [];
                        value.forEach((child) => {
                            const child_id = child[id(child).name];
                            if (!utils_1.default.isUndefined(child_id)) {
                                children_ids.push(child_id);
                            }
                        });
                        if (children_ids.length > 0) {
                            data[key.name] = children_ids;
                        }
                    }
                }
                else {
                    promises.push(utils_1.default.when(value).then((final) => {
                        if (!utils_1.default.isUndefined(final)) {
                            data[key.name] = final;
                        }
                    }));
                }
            });
            return Promise.all(promises).then(() => {
                if (insert) {
                    return collection(this).insertOne(data).then((result) => {
                        this[primary.name] = result.insertedId;
                        return this;
                    });
                }
                else {
                    return collection(this).updateOne({
                        _id: primary_id
                    }, {
                        $set: data
                    }).then((result) => {
                        if (result.modifiedCount === 0) {
                            const Exception = schema(this).modeljs.Exception;
                            throw new Exception('Document with `' + primary.name + '` `' + primary_id.toHexString() + '` does not exist');
                        }
                        return this;
                    });
                }
            });
        }).then(() => {
            return utils_1.default.hook(this, ['afterSave', (insert ? 'afterInsert' : 'afterUpdate')]);
        });
    }
    /**
     * Validate
     * @return Always return a resolved array of ValidationResult
     * Rejected values are critical errors
     */
    validate(options) {
        const depth = (options || {}).depth || 0, promises = [], Result = schema(this).modeljs.ValidationResult;
        return utils_1.default.hook(this, 'beforeValidate').then(() => {
            schema(this).keys.forEach((key) => {
                let value = this[key.name], config = key.type.Constructor.typeConfig;
                if (value && config instanceof type_1.TypeConfig && !utils_1.default.isUndefined(config.validate)) {
                    value = value[config.validate]();
                }
                if (!utils_1.default.isUndefined(value)) {
                    promises.push((new Promise((resolve) => {
                        const result = new Result({
                            key: key,
                            value: value
                        });
                        key.validate(this, value).then(() => {
                            resolve(result);
                        }).catch((messages) => {
                            result.messages = messages;
                            resolve(result);
                        });
                    })).then((result) => {
                        if (depth > 0 && value instanceof Model) {
                            return new Promise((resolve) => {
                                value.validate(lodash_1.extend({}, options, {
                                    depth: depth - 1
                                })).then((child) => {
                                    result.child = child;
                                    resolve(result);
                                });
                            });
                        }
                        else if (depth > 0 && value instanceof collection_1.default) {
                            return new Promise((resolve) => {
                                value.validate(lodash_1.extend({}, options, {
                                    depth: depth - 1
                                })).then((child) => {
                                    result.child = child;
                                    resolve(result);
                                });
                            });
                        }
                        else {
                            return result;
                        }
                    }));
                }
            });
            return Promise.all(promises);
        }).then((validationResults) => {
            return utils_1.default.hook(this, 'afterValidate').then(() => {
                return validationResults;
            });
        });
    }
}
exports.default = Model;
