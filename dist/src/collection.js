"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const javascript_model_1 = require("javascript-model");
const utils_1 = require("./utils");
/**
 * Collection
 */
class Collection extends javascript_model_1.Collection {
    /**
     * Get collection name
     */
    static get collection() {
        return this.Model.schema.cache.collection.name;
    }
    /**
     * Count
     */
    static count(query, preferences) {
        return this.Model.schema.modeljs.db.collection(this.collection).countDocuments(query || {}, preferences);
    }
    /**
     * Find multiple
     */
    static find(query, options, reloadOptions) {
        const collection = new this();
        return pull(this.Model.schema.modeljs.db.collection(this.collection).find(query || {}, options)).then((cursor) => {
            if (collection.length > 0 && !utils_1.default.isUndefined(reloadOptions)) {
                return collection.reload(reloadOptions);
            }
            return collection;
        });
        /**
         * Pull next data
         */
        function pull(cursor) {
            return cursor.hasNext().then((next) => {
                if (next === true) {
                    return cursor.next().then((data) => {
                        if (data) {
                            collection.push(data);
                        }
                        return pull(cursor);
                    });
                }
                else {
                    return cursor;
                }
            });
        }
    }
    /**
     * Delete multiple
     */
    delete(options) {
        return utils_1.default.hook(this, 'beforeDelete').then(() => {
            return Promise.all(this.map((model) => {
                return model.delete(options);
            })).then(() => {
                return null;
            });
        }).then(() => {
            return utils_1.default.hook(this, 'afterDelete').then(() => {
                return null;
            });
        });
    }
    /**
     * Reload
     */
    reload(options) {
        return utils_1.default.hook(this, 'beforeReload').then(() => {
            return Promise.all(this.map((model) => {
                return model.reload(options);
            })).then(() => {
                return this;
            });
        }).then(() => {
            return utils_1.default.hook(this, 'afterReload');
        });
    }
    /**
     * Save
     */
    save(options) {
        return utils_1.default.hook(this, 'beforeSave').then(() => {
            return Promise.all(this.map((model) => {
                return model.save(options);
            })).then(() => {
                return this;
            });
        }).then(() => {
            return utils_1.default.hook(this, 'afterSave');
        });
    }
    /**
     * Validate
     */
    validate(options) {
        return utils_1.default.hook(this, 'beforeValidate').then(() => {
            return Promise.all(this.map((model) => {
                return model.validate(options);
            }));
        }).then((arrayOfValidationResults) => {
            return utils_1.default.hook(this, 'afterValidate').then(() => {
                return arrayOfValidationResults;
            });
        });
    }
}
exports.default = Collection;
