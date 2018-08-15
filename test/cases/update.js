"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const address_model_1 = require("../src/address.model");
const company_model_1 = require("../src/company.model");
const companies_collection_1 = require("../src/companies.collection");
const dist_1 = require("../../dist");
const user_model_1 = require("../src/user.model");
const users_collection_1 = require("../src/users.collection");
/**
 * Update documents
 */
function updateDocuments(config) {
    describe('update documents', () => {
        it('should update companies with corresponding users', (done) => {
            users_collection_1.default.find({}, {
                projection: {
                    _id: 1,
                    company: 1
                }
            }).then((users) => {
                Promise.all(users.map((user) => {
                    return company_model_1.default.find({
                        _id: user.company.id
                    }, {
                        projection: {
                            _id: 1
                        }
                    }).then((company) => {
                        company.user = user.id;
                        return company;
                    });
                })).then((arr) => {
                    const companies = new companies_collection_1.default(arr);
                    companies.save().then(() => {
                        chai_1.assert.isOk(true, 'companies updated successfully');
                        done();
                    }).catch((err) => {
                        chai_1.assert.isNotOk(err, 'failed to update companies');
                        done();
                    });
                }).catch((err) => {
                    chai_1.assert.isNotOk(err, 'failed to load companies');
                    done();
                });
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to load users');
                done();
            });
        });
        it('should validate the users associated to the companies', (done) => {
            companies_collection_1.default.find({
                depth: 2
            }).then((companies) => {
                companies.forEach((company) => {
                    chai_1.assert.instanceOf(company.user, user_model_1.default, 'company `user` must be an instance of `User`');
                    chai_1.assert.instanceOf(company.address, address_model_1.default, 'company `address` must be an instance of `Address`');
                    chai_1.assert.instanceOf(company.user.address, address_model_1.default, 'company user `address` must be an instance of `Address`');
                    chai_1.assert.instanceOf(company.updated, dist_1.Timestamp, 'company `updated` must be an instance of `Timestamp`');
                });
                done();
            });
        });
    });
}
exports.default = updateDocuments;
