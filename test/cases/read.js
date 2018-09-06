"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const mongodb_1 = require("mongodb");
const dist_1 = require("../../dist");
const address_model_1 = require("../src/address.model");
const company_model_1 = require("../src/company.model");
const user_model_1 = require("../src/user.model");
const users_collection_1 = require("../src/users.collection");
/**
 * Read documents
 */
function readDocuments(config) {
    describe('read documents', () => {
        let users;
        it('should retrieve multiple users', (done) => {
            users_collection_1.default.find({}, {
                projection: {
                    _id: 1
                }
            }).then((data) => {
                data.reload({
                    populate: [
                        'address',
                        {
                            path: 'company',
                            populate: [
                                'address'
                            ]
                        }
                    ]
                }).then(() => {
                    users = data;
                    chai_1.assert.isOk(true, 'retrieved users successfully');
                    done();
                }).catch((err) => {
                    chai_1.assert.isNotOk(err, 'failed to reload users');
                    done();
                });
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to retrieve users');
                done();
            });
        });
        it('should validate user password', (done) => {
            users[0].password.validate(config.user.password).then((equal) => {
                chai_1.assert.strictEqual(equal, true, 'user password must be valid');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to validate password');
                done();
            });
        });
        it('should verify the types of the properties of all users', () => {
            users.forEach((user) => {
                chai_1.assert.instanceOf(user.address, address_model_1.default, 'user `address` must be an instance of `Address`');
                chai_1.assert.instanceOf(user.birth_date, Date, 'user `birth_date` must be an instance of `Date`');
                chai_1.assert.instanceOf(user.company, company_model_1.default, 'user `company` must be an instance of `Company`');
                chai_1.assert.instanceOf(user.created, dist_1.Timestamp, 'user `created` must be an instance of `Timestamp`');
                chai_1.assert.typeOf(user.email, 'string', 'user `email` must be a string');
                chai_1.assert.typeOf(user.first_name, 'string', 'user `first_name` must be a string');
                chai_1.assert.instanceOf(user.id, mongodb_1.ObjectId, 'user `id` must be an instance of `ObjectId`');
                chai_1.assert.typeOf(user.last_name, 'string', 'user `last_name` must be a string');
                chai_1.assert.instanceOf(user.password, dist_1.Password, 'user `password` must be an instance of `Password`');
                chai_1.assert.typeOf(user.sex, 'string', 'user `sex` must be a string');
            });
        });
        it('should verify the types of the properties of all companies', () => {
            users.forEach((user) => {
                ((company) => {
                    chai_1.assert.instanceOf(company.address, address_model_1.default, 'company `address` must be an instance of `Address`');
                    chai_1.assert.instanceOf(company.created, dist_1.Timestamp, 'company `created` must be an instance of `Timestamp`');
                    chai_1.assert.instanceOf(company.id, mongodb_1.ObjectId, 'company `id` must be an instance of `ObjectId`');
                    chai_1.assert.typeOf(company.name, 'string', 'company `name` must be a string');
                    chai_1.assert.instanceOf(company.permalink, dist_1.Permalink, 'company `permalink` must be a string');
                })(user.company);
            });
        });
        it('should verify the types of the properties of all addresses', () => {
            users.forEach((user) => {
                [user.address, user.company.address].forEach((address) => {
                    chai_1.assert.typeOf(address.city, 'string', 'address `city` must be a string');
                    chai_1.assert.instanceOf(address.created, dist_1.Timestamp, 'address `created` must be an instance of `Timestamp`');
                    chai_1.assert.instanceOf(address.id, mongodb_1.ObjectId, 'address `id` must be an instance of `ObjectId`');
                    chai_1.assert.typeOf(address.latitude, 'number', 'address `latitude` must be a number');
                    chai_1.assert.typeOf(address.longitude, 'number', 'address `longitude` must be a number');
                    chai_1.assert.typeOf(address.street, 'string', 'address `street` must be a string');
                    chai_1.assert.typeOf(address.zip_code, 'string', 'zip_code `street` must be a string');
                });
            });
        });
        it('should return `null` if model is not found', (done) => {
            user_model_1.default.find({ email: '...' }).then((user) => {
                chai_1.assert.strictEqual(user, null, '`user` must be null');
                done();
            });
        });
    });
}
exports.default = readDocuments;
