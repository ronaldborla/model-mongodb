"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const lodash_1 = require("lodash");
const type_1 = require("../type");
/**
 * Default generator
 */
const defaultPasswordGenerator = {
    generateHash: (password, salt) => {
        return new Promise((resolve, reject) => {
            bcrypt_1.hash(password, salt, (err, encrypted) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(encrypted);
                }
            });
        });
    },
    generateSalt: (rounds) => {
        return new Promise((resolve, reject) => {
            bcrypt_1.genSalt(rounds || 10, (err, salt) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(salt);
                }
            });
        });
    },
    validate: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt_1.compare(password, hash, (err, same) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(same === true);
                }
            });
        });
    },
};
/**
 * Password
 */
class Password {
    constructor(data, options) {
        this.value = data;
        this.options = options || {};
        if (lodash_1.isUndefined(this.options.generator)) {
            this.options.generator = defaultPasswordGenerator;
        }
        if (lodash_1.isUndefined(this.options.rounds)) {
            this.options.rounds = 10;
        }
    }
    /**
     * Generator
     */
    get generator() {
        return this.options.generator;
    }
    /**
     * Validate
     */
    validate(password) {
        if (lodash_1.isString(this.value)) {
            return Promise.resolve(this.value === password);
        }
        else {
            return this.generator.validate(password, this.value.hash);
        }
    }
    /**
     * To object
     */
    toObject() {
        return this.value ? (this.value.hash || this.value) : undefined;
    }
    /**
     * To save
     */
    toSave() {
        if (lodash_1.isString(this.value)) {
            return this.generator.generateSalt(parseInt(this.options.rounds)).then((salt) => {
                return this.generator.generateHash(this.value, salt).then((hash) => {
                    return this.value = {
                        hash: hash,
                        salt: salt
                    };
                });
            });
        }
        else {
            return Promise.resolve(this.value);
        }
    }
    /**
     * To string
     */
    toString() {
        return this.toValidate();
    }
    /**
     * To validate
     */
    toValidate() {
        return lodash_1.isString(this.value) ? this.value : undefined;
    }
}
/**
 * Type Config
 */
Password.typeConfig = new type_1.TypeConfig({
    save: 'toSave',
    validate: 'toValidate'
});
exports.default = Password;
