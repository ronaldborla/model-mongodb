"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * Max field
 */
const max = {
    callback: function (value, key, options) {
        return value <= parseFloat(options[0]);
    },
    init: function () {
        if (utils_1.default.isUndefined(this.options) || !utils_1.default.isArray(this.options) || utils_1.default.isUndefined(this.options[0])) {
            throw new this.key.schema.modeljs.Exception('Missing or invalid `max` value for key `' + this.key.name + '`');
        }
    },
    message: function (value, key, options) {
        return 'Value cannot be greater than ' + options[0];
    },
    name: 'max'
};
exports.default = max;
