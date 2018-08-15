"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
/**
 * Enum field
 */
const enumv = {
    callback: function (value, key, options) {
        return options.indexOf(value) >= 0;
    },
    init: function () {
        if (utils_1.default.isUndefined(this.options) || !utils_1.default.isArray(this.options) || !this.options.length) {
            throw new this.key.schema.modeljs.Exception('Missing or invalid enum options for key `' + this.key.name + '`');
        }
    },
    message: function (value, key, options) {
        return 'Invalid ' + lodash_1.replace(lodash_1.snakeCase(key.name), '_', ' ') + ': ' + value;
    },
    name: 'enum'
};
exports.default = enumv;
