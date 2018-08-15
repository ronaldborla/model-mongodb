"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const collection_1 = require("./collection");
const model_1 = require("./model");
const utils_1 = require("./utils");
/**
 * ValidationResult
 */
class ValidationResult {
    constructor(data) {
        /**
         * Nested results
         */
        this.child = null;
        /**
         * Result messages
         */
        this.messages = [];
        ['child', 'key', 'messages', 'value'].forEach((name) => {
            if (!utils_1.default.isUndefined(data[name])) {
                this[name] = data[name];
            }
        });
    }
    /**
     * Flatten validation results
     */
    static flatten(validationResults, prefix) {
        const results = [];
        validationResults.forEach((result) => {
            const key = prefix ? (prefix + '.' + result.key.name) : result.key.name;
            if (result.failed === true) {
                results.push([key, result.messages]);
            }
            if (result.child) {
                if (result.value instanceof model_1.default) {
                    this.flatten(result.child, key).forEach((flattened) => {
                        results.push(flattened);
                    });
                }
                else if (result.value instanceof collection_1.default) {
                    result.child.forEach((subvalidationResults, index) => {
                        this.flatten(subvalidationResults, key + '.' + index).forEach((subflattened) => {
                            results.push(subflattened);
                        });
                    });
                }
            }
        });
        return results;
    }
    /**
     * Check if failed
     */
    get failed() {
        return !this.passed;
    }
    /**
     * Check if passed
     */
    get passed() {
        return this.messages.length === 0;
    }
}
exports.ValidationResult = ValidationResult;
/**
 * Validator
 */
class Validator {
    constructor(key, options) {
        this.key = key;
        ['block', 'callback', 'name', 'message', 'options', 'regex'].forEach((name) => {
            if (!utils_1.default.isUndefined(options[name])) {
                this[name] = options[name];
            }
        });
    }
    /**
     * Execute validation
     * @return Promise with validated value if passed,
     * otherise, a rejection with the message
     */
    execute(model, value) {
        const key = this.key;
        return (new Promise((resolve, reject) => {
            if (utils_1.default.isFunction(this.callback)) {
                utils_1.default.when(this.callback.apply(model, [value, key, this.options])).then((result) => {
                    if (result === true || result === null) {
                        resolve(value);
                    }
                    else {
                        reject((utils_1.default.isString(result) && result) ? result : '');
                    }
                }).catch((error) => {
                    reject((utils_1.default.isString(error) && error) ? error : '');
                });
            }
            else if (utils_1.default.isRegExp(this.regex)) {
                if (this.regex.test(value + '')) {
                    resolve(value);
                }
                else {
                    reject('');
                }
            }
        })).catch((message) => {
            if (message) {
                return Promise.reject(message);
            }
            if (utils_1.default.isString(this.message)) {
                return Promise.reject(this.message);
            }
            if (utils_1.default.isFunction(this.message)) {
                return utils_1.default.when(this.message.apply(model, [value, key, this.options])).then((result) => {
                    return errorMessage(result);
                }).catch((error) => {
                    return errorMessage(error);
                });
            }
            return errorMessage(null);
            /**
             * Default message
             */
            function errorMessage(error) {
                if (utils_1.default.isString(error) && error) {
                    return Promise.reject(error);
                }
                return Promise.reject('Validation failed for ' + lodash_1.replace(lodash_1.snakeCase(key.name), '_', ' '));
            }
        });
    }
}
exports.default = Validator;
