"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
/**
 * Address
 */
class Address extends base_model_1.default {
}
Address.Collection = 'Addresses';
Address.schema = {
    city: {
        type: String,
        validators: ['required']
    },
    latitude: Number,
    longitude: Number,
    street: {
        type: String,
        validators: ['required']
    },
    zip_code: String
};
exports.default = Address;
