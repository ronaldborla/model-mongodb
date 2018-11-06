"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Uppercase filter
 * Trims only whitespaces
 */
const upper = {
    callback: (value, key, options) => {
        if (!lodash_1.isUndefined(value) && value !== null) {
            value = (value + '').toUpperCase();
        }
        return value;
    },
    name: 'upper'
};
exports.default = upper;
