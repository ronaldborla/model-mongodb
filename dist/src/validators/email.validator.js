"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Field is email validator
 */
const email = {
    message: function (model, key, value) {
        return 'Invalid ' + lodash_1.replace(lodash_1.snakeCase(key.name), '_', ' ');
    },
    name: 'email',
    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};
exports.default = email;
