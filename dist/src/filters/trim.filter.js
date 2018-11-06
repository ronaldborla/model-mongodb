"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Trim filter
 * Trims only whitespaces
 */
const trimFilter = {
    callback: (value, key, options) => {
        if (!lodash_1.isUndefined(value) && value !== null) {
            if (!lodash_1.isUndefined(options) && !lodash_1.isUndefined(options[0])) {
                if (options[0] === 'start') {
                    value = lodash_1.trimStart(value + '');
                }
                else if (options[0] === 'end') {
                    value = lodash_1.trimEnd(value + '');
                }
                else {
                    throw new key.schema.modeljs.Exception('Invalid trim option: ' + options[0]);
                }
            }
            else {
                value = lodash_1.trim(value + '');
            }
        }
        return value;
    },
    name: 'trim'
};
exports.default = trimFilter;
