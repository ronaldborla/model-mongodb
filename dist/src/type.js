"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const javascript_model_1 = require("javascript-model");
/**
 * Type Config
 */
class TypeConfig {
    constructor(config) {
        lodash_1.forEach(config, (value, key) => {
            this[key] = value;
        });
    }
}
exports.TypeConfig = TypeConfig;
/**
 * Type
 */
class Type extends javascript_model_1.Type {
}
exports.default = Type;
