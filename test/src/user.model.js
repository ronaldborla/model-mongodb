"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
/**
 * Users
 */
class User extends base_model_1.default {
    /**
     * Get full name
     */
    get full_name() {
        return [this.first_name, this.last_name].join(' ');
    }
}
User.Collection = 'Users';
User.schema = {
    address: 'Address',
    birth_date: Date,
    company: 'Company',
    email: {
        type: String,
        validators: [
            'required',
            'email'
        ]
    },
    first_name: {
        type: String,
        validators: ['required']
    },
    last_name: {
        type: String,
        validators: ['required']
    },
    password: 'Password',
    sex: {
        type: String,
        validators: [{
                name: 'enum',
                options: [
                    'male',
                    'female'
                ]
            }]
    }
};
exports.default = User;
