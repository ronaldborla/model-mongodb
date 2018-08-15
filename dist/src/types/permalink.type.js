"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const exception_1 = require("../exception");
const type_1 = require("../type");
const latinize = require('latinize');
/**
 * Cast to permalink
 */
function cast(text) {
    return lodash_1.trim(latinize(text)
        .replace(/["'`]/g, '')
        .replace(/[^A-Za-z0-9]/g, '-')
        .replace(/--+/g, '-')
        .toLowerCase(), '-');
}
/**
 * Permalink
 */
class Permalink {
    constructor(data, options) {
        if (!lodash_1.isObject(options)) {
            throw new exception_1.default('Missing options for permalink type');
        }
        if (lodash_1.isUndefined(options.key)) {
            throw new exception_1.default('Missing key for permalink type');
        }
        if (lodash_1.isUndefined(options.parent)) {
            throw new exception_1.default('Missing model instance for permalink type');
        }
        this.options = options;
        if (lodash_1.isUndefined(this.options.source)) {
            this.options.source = this.options.parent.constructor.schema.cache.index.name;
        }
        if (!lodash_1.isFunction(this.options.fn)) {
            this.options.fn = cast;
        }
        if (lodash_1.isString(data)) {
            this.value = data;
        }
    }
    /**
     * Boot
     */
    static boot(modeljs) {
        const promises = [];
        this.cache = {};
        modeljs.schemas.forEach((schema) => {
            const projection = {};
            schema.keys.forEach((key) => {
                if (key.type.Constructor.isPermalink === true) {
                    if (lodash_1.isUndefined(this.cache[schema.Model.name])) {
                        this.cache[schema.Model.name] = {};
                    }
                    this.cache[schema.Model.name][key.name] = {};
                    projection[key.name] = 1;
                }
            });
            promises.push(schema.Model.Collection.find({}, {
                projection: projection
            }).then((collection) => {
                collection.forEach((item) => {
                    Object.keys(projection).forEach((key) => {
                        if (item[key] instanceof Permalink) {
                            this.cache[schema.Model.name][key][item[key].value] = true;
                        }
                    });
                });
                return true;
            }));
        });
        return Promise.all(promises).then(() => {
            return modeljs;
        });
    }
    /**
     * Get cache
     */
    get cache() {
        const cache = this.constructor.cache, name = this.parent.constructor.name;
        if (lodash_1.isUndefined(cache[name])) {
            cache[name] = {};
        }
        if (lodash_1.isUndefined(cache[name][this.key.name])) {
            cache[name][this.key.name] = {};
        }
        return cache[name][this.key.name];
    }
    /**
     * The function to use
     */
    get fn() {
        return this.options.fn;
    }
    /**
     * The key
     */
    get key() {
        return this.options.key;
    }
    /**
     * The parent
     */
    get parent() {
        return this.options.parent;
    }
    /**
     * Source
     */
    get source() {
        return this.options.source;
    }
    /**
     * Generate permalink
     */
    generate() {
        const cache = this.cache, source = lodash_1.get(this.parent, this.source);
        if (lodash_1.isUndefined(source)) {
            return this.value = undefined;
        }
        if (this.value && !lodash_1.isUndefined(cache[this.value])) {
            delete cache[this.value];
        }
        const permalink = this.fn((source instanceof mongodb_1.ObjectId) ? source.toHexString() : (source + ''));
        let generated = permalink, index = 1;
        while (cache[generated] === true) {
            generated = permalink + '-' + (++index);
        }
        cache[generated] = true;
        return this.value = generated;
    }
    /**
     * To object
     */
    toObject() {
        return this.value;
    }
    /**
     * To string
     */
    toString() {
        return this.toValidate() || '';
    }
    /**
     * To validate
     */
    toValidate() {
        return this.value;
    }
}
/**
 * Cache
 */
Permalink.cache = {};
/**
 * Is permalink
 */
Permalink.isPermalink = true;
/**
 * Type config
 */
Permalink.typeConfig = new type_1.TypeConfig({
    boot: 'boot',
    default: '',
    save: 'generate',
    validate: 'toValidate'
});
exports.default = Permalink;
