"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const address_model_1 = require("../src/address.model");
const addresses_collection_1 = require("../src/addresses.collection");
const company_model_1 = require("../src/company.model");
const companies_collection_1 = require("../src/companies.collection");
const user_model_1 = require("../src/user.model");
const users_collection_1 = require("../src/users.collection");
/**
 * Delete documents
 */
function deleteDocuments(config) {
    describe('delete documents', () => {
        it('should delete one user', (done) => {
            user_model_1.default.find().then((user) => {
                user.delete().then(() => {
                    chai_1.assert.isOk(true, 'user successfully deleted');
                    done();
                }).catch((err) => {
                    chai_1.assert.isNotOk(err, 'failed to delete user');
                    done();
                });
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to retrieve user');
                done();
            });
        });
        it('should verify that there are ' + (config.count - 1) + ' users left', (done) => {
            users_collection_1.default.count().then((count) => {
                chai_1.assert.strictEqual(count, config.count - 1, 'remaining users count must match');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to count users');
                done();
            });
        });
        [{
                collection: users_collection_1.default,
                model: user_model_1.default,
                name: 'users'
            }, {
                collection: companies_collection_1.default,
                model: company_model_1.default,
                name: 'companies'
            }, {
                collection: addresses_collection_1.default,
                model: address_model_1.default,
                name: 'addresses'
            }].forEach((item) => {
            it('should delete all ' + item.name, (done) => {
                item.collection.find({}, {
                    projection: {
                        _id: 1
                    }
                }).then((collection) => {
                    collection.delete().then(() => {
                        chai_1.assert.isOk(true, item.name + ' deleted successfully');
                        done();
                    }).catch((err) => {
                        chai_1.assert.isNotOk(err, 'failed to delete ' + item.name);
                        done();
                    });
                });
            });
            it('should verify that there are no more ' + item.name + ' left', (done) => {
                item.collection.count().then((count) => {
                    chai_1.assert.strictEqual(count, 0, 'remaining ' + item.name + ' must be 0');
                    done();
                }).catch((err) => {
                    chai_1.assert.isNotOk(err, 'failed to count ' + item.name);
                    done();
                });
            });
        });
    });
}
exports.default = deleteDocuments;
