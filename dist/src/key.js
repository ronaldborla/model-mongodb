"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const javascript_model_1 = require("javascript-model");
const validator_1 = require("./validator");
const utils_1 = require("./utils");
/**
 * Key
 */
class Key extends javascript_model_1.Key {
    /**
     * Override constructor
     */
    constructor(schema, name, object) {
        super(schema, name, object);
        /**
         * Validators
         */
        this.validators = [];
        let validators = object.validators || object.validator || [];
        if (!utils_1.default.isUndefined(validators) && !utils_1.default.isArray(validators)) {
            validators = [validators];
        }
        this.validators = validators.map((data) => {
            if (data instanceof validator_1.default) {
                return data;
            }
            let validator = {};
            if (utils_1.default.isString(data)) {
                validator.name = data;
            }
            else if (utils_1.default.isFunction(data)) {
                validator.callback = data;
            }
            else if (utils_1.default.isRegExp(data)) {
                validator.regex = data;
            }
            else if (utils_1.default.isObject(data)) {
                validator = data;
            }
            if (utils_1.default.isString(validator.name)) {
                const arr = validator.name.split(':');
                if (utils_1.default.isUndefined(this.schema.modeljs.validators[arr[0]])) {
                    throw new this.schema.modeljs.Exception('Validator `' + arr[0] + '` is not registered');
                }
                validator = lodash_1.extend(this.schema.modeljs.validators[arr[0]], validator);
                if (!utils_1.default.isUndefined(arr[1]) && arr[1] && utils_1.default.isUndefined(validator.options)) {
                    validator.options = arr[1].split(',');
                }
            }
            const hasCallback = !utils_1.default.isUndefined(validator.callback), hasRegex = !utils_1.default.isUndefined(validator.regex), init = validator.init;
            if (hasCallback && !utils_1.default.isFunction(validator.callback)) {
                throw new this.schema.modeljs.Exception('Validator callback must be a function');
            }
            if (hasRegex) {
                if (!utils_1.default.isRegExp(validator.regex)) {
                    throw new this.schema.modeljs.Exception('Validator regex must be a regular expression');
                }
                if (this.type.Constructor !== String) {
                    throw new this.schema.modeljs.Exception('Key to validate using regex must be a string');
                }
                if (utils_1.default.isUndefined(validator.message)) {
                    validator.message = 'Invalid ' + lodash_1.replace(lodash_1.snakeCase(name), '_', ' ');
                }
            }
            if (!utils_1.default.isUndefined(validator.options) && !utils_1.default.isArray(validator.options)) {
                throw new this.schema.modeljs.Exception('Validator options must be an array');
            }
            if (!hasCallback && !hasRegex) {
                throw new this.schema.modeljs.Exception('Validator must have a callback or regex');
            }
            validator = new schema.modeljs.Validator(this, validator);
            if (utils_1.default.isFunction(init)) {
                init.apply(validator, []);
            }
            return validator;
        });
    }
    /**
     * Validate key
     * @return Promise with resolved value or rejected error messages
     */
    validate(model, value) {
        return new Promise((resolve, reject) => {
            const key = this, messages = [];
            /**
             * Queued execution of validators
             */
            function execute(index) {
                if (utils_1.default.isUndefined(key.validators[index])) {
                    if (messages.length > 0) {
                        reject(messages);
                    }
                    else {
                        resolve(value);
                    }
                }
                else {
                    key.validators[index].execute(model, value).then((resolved) => {
                        value = resolved;
                        execute(index + 1);
                    }).catch((message) => {
                        messages.push(message);
                        if (key.validators[index].block === true) {
                            execute(-1);
                        }
                        else {
                            execute(index + 1);
                        }
                    });
                }
            }
            execute(0);
        });
    }
}
exports.default = Key;
