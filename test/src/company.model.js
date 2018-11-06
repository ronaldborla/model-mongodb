"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
/**
 * Company
 */
class Company extends base_model_1.default {
}
Company.Collection = 'Companies';
Company.schema = {
    address: 'Address',
    name: {
        filters: [
            'trim:end'
        ],
        type: String,
        validators: ['required']
    },
    permalink: {
        options: {
            source: 'name'
        },
        type: 'Permalink'
    },
    user: 'User'
};
exports.default = Company;
