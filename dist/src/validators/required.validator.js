"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
/**
 * Field is required validator
 */
const required = {
    callback: function (value, key) {
        if (value === null) {
            return false;
        }
        if (utils_1.default.isString(value) && lodash_1.trim(value) === '') {
            return false;
        }
        return true;
    },
    message: function (value, key) {
        return lodash_1.upperFirst(lodash_1.replace(lodash_1.snakeCase(key.name), '_', ' ')) + ' is required';
    },
    name: 'required'
};
exports.default = required;
