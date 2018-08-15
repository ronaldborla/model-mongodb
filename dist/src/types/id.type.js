"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const type_1 = require("../type");
/**
 * The ID
 */
class Id extends mongodb_1.ObjectId {
    /**
     * To object
     */
    toObject() {
        return this.toHexString();
    }
}
/**
 * Type Config
 */
Id.typeConfig = new type_1.TypeConfig({
    validate: 'toHexString'
});
exports.default = Id;
