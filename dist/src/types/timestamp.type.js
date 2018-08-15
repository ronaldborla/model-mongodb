"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
/**
 * Timestamp
 */
class Timestamp {
    constructor(value, options) {
        options = options || {};
        this.type = options.type || 'save';
        this.value = value;
    }
    /**
     * To insert
     */
    toInsert() {
        if (this.type === 'insert' || this.type === 'save') {
            return new Date();
        }
        return undefined;
    }
    /**
     * To object
     */
    toObject() {
        return this.value ? (this.value + '') : undefined;
    }
    /**
     * To update
     */
    toUpdate() {
        if (this.type === 'update' || this.type === 'save') {
            return new Date();
        }
        return undefined;
    }
    /**
     * To validate
     */
    toValidate() {
        return this.value;
    }
}
/**
 * Type config
 */
Timestamp.typeConfig = new type_1.TypeConfig({
    default: () => {
        return new Date();
    },
    insert: 'toInsert',
    update: 'toUpdate',
    validate: 'toValidate'
});
exports.default = Timestamp;
