"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const javascript_model_1 = require("javascript-model");
const utils_1 = require("./utils");
const id_type_1 = require("./types/id.type");
/**
 * Schema
 */
class Schema extends javascript_model_1.Schema {
    constructor(modeljs, model) {
        super(modeljs, model);
        this.cache.collection = {
            name: lodash_1.snakeCase(this.Model.Collection.name)
        };
        this.cache.index.id = null;
        this.keys.forEach((key) => {
            if (utils_1.default.inherits(key.type.Constructor, id_type_1.default)) {
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
exports.default = Schema;
