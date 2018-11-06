"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Lowercase filter
 * Trims only whitespaces
 */
const lower = {
    callback: (value, key, options) => {
        if (!lodash_1.isUndefined(value) && value !== null) {
            value = (value + '').toLowerCase();
        }
        return value;
    },
    name: 'lower'
};
exports.default = lower;
