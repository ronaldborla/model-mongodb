"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const javascript_model_1 = require("javascript-model");
const exception_1 = require("./exception");
const key_1 = require("./key");
const schema_1 = require("./schema");
const type_1 = require("./type");
const validator_1 = require("./validator");
const mongodb_1 = require("mongodb");
const utils_1 = require("./utils");
/**
 * Import types
 */
const id_type_1 = require("./types/id.type");
const password_type_1 = require("./types/password.type");
const permalink_type_1 = require("./types/permalink.type");
const timestamp_type_1 = require("./types/timestamp.type");
/**
 * Import filters
 */
const lower_filter_1 = require("./filters/lower.filter");
const trim_filter_1 = require("./filters/trim.filter");
const upper_filter_1 = require("./filters/upper.filter");
/**
 * Import validators
 */
const email_validator_1 = require("./validators/email.validator");
const enum_validator_1 = require("./validators/enum.validator");
const max_validator_1 = require("./validators/max.validator");
const min_validator_1 = require("./validators/min.validator");
const required_validator_1 = require("./validators/required.validator");
/**
 * Model JS
 */
class ModelJS extends javascript_model_1.ModelJS {
    constructor() {
        super();
        /**
         * Attachments
         */
        this.attachments = {};
        /**
         * Override Exception
         */
        this.Exception = exception_1.default;
        /**
         * Filters
         */
        this.filters = {};
        /**
         * Override Key
         */
        this.Key = key_1.default;
        /**
         * Override Schema
         */
        this.Schema = schema_1.default;
        /**
         * Override Type
         */
        this.Type = type_1.default;
        /**
         * ValidationResult
         */
        this.ValidationResult = validator_1.ValidationResult;
        /**
         * Validator
         */
        this.Validator = validator_1.default;
        /**
         * Validators
         */
        this.validators = {};
        this.register([
            id_type_1.default,
            password_type_1.default,
            permalink_type_1.default,
            timestamp_type_1.default
        ]);
        [lower_filter_1.default, trim_filter_1.default, upper_filter_1.default].forEach((filter) => {
            this.filters[filter.name] = filter;
        });
        [email_validator_1.default, enum_validator_1.default, max_validator_1.default, min_validator_1.default, required_validator_1.default].forEach((validator) => {
            this.validators[validator.name] = validator;
        });
    }
    /**
     * Attach anything
     */
    attach(key, value) {
        if (utils_1.default.isUndefined(value)) {
            return this.attachments[key];
        }
        else {
            this.attachments[key] = value;
            return this;
        }
    }
    /**
     * Close database
     */
    close(force) {
        return this.client.close(force).then(() => {
            return this;
        });
    }
    /**
     * Connect to mongodb
     */
    connect(url, database, options) {
        if (!this.schemas.length) {
            this.boot();
        }
        if (!database) {
            throw new this.Exception('Database name is required');
        }
        return mongodb_1.MongoClient.connect(url, options).then((client) => {
            const promises = [];
            this.client = client;
            this.db = this.client.db(database);
            utils_1.default.forEach(this.types, (type, name) => {
                if (type && type.typeConfig instanceof type_1.TypeConfig && !utils_1.default.isUndefined(type.typeConfig.boot)) {
                    promises.push(type[type.typeConfig.boot](this));
                }
            });
            return Promise.all(promises).then(() => {
                return this;
            });
        });
    }
}
exports.default = ModelJS;
