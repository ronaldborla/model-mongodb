"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const faker_1 = require("faker");
const addresses_collection_1 = require("../src/addresses.collection");
const companies_collection_1 = require("../src/companies.collection");
const users_collection_1 = require("../src/users.collection");
const dist_1 = require("../../dist");
/**
 * Create documents
 */
function createDocuments(config) {
    const count = config.count || 100;
    describe('create documents', () => {
        const users = new users_collection_1.default();
        it('should validate users, companies, and addresses', (done) => {
            let i = count;
            while (i-- > 0) {
                users.push({
                    address: {
                        city: faker_1.address.city(),
                        latitude: parseFloat(faker_1.address.latitude()),
                        longitude: parseFloat(faker_1.address.longitude()),
                        street: faker_1.address.streetAddress(),
                        zip_code: faker_1.address.zipCode(),
                    },
                    birth_date: faker_1.date.past(50),
                    company: {
                        address: {
                            city: faker_1.address.city(),
                            latitude: parseFloat(faker_1.address.latitude()),
                            longitude: parseFloat(faker_1.address.longitude()),
                            street: faker_1.address.streetAddress(),
                            zip_code: faker_1.address.zipCode(),
                        },
                        name: faker_1.company.companyName()
                    },
                    email: faker_1.internet.email(),
                    first_name: faker_1.name.firstName(),
                    last_name: faker_1.name.lastName(),
                    password: config.user.password || faker_1.internet.password(8, true),
                    sex: ['male', 'female'][faker_1.random.number(1)]
                });
            }
            users.validate({ depth: 2 }).then((arrayOfValidationResults) => {
                const flattened = arrayOfValidationResults.map((validationResults) => {
                    return dist_1.ValidationResult.flatten(validationResults);
                }).filter((validationResults) => {
                    return validationResults.length > 0;
                });
                chai_1.assert.strictEqual(flattened.length, 0, 'validation results must be empty');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to validate documents');
                done();
            });
        });
        it('should create users, companies, and addresses', (done) => {
            users.save({ depth: 2 }).then(() => {
                chai_1.assert.isOk(true, 'documents created successfully');
                done();
            }).catch((err) => {
                console.log(err);
                chai_1.assert.isNotOk(err, 'failed to create documents');
                done();
            });
        });
        it('should match the number of created users', (done) => {
            users_collection_1.default.count().then((usersCount) => {
                chai_1.assert.strictEqual(usersCount, count, 'users count mismatch');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to count users');
                done();
            });
        });
        it('should match the number of created companies', (done) => {
            companies_collection_1.default.count().then((companiesCount) => {
                chai_1.assert.strictEqual(companiesCount, count, 'companies count mismatch');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to count companies');
                done();
            });
        });
        it('should match the number of created addresses', (done) => {
            addresses_collection_1.default.count().then((addressesCount) => {
                chai_1.assert.strictEqual(addressesCount, count * 2, 'addresses count mismatch');
                done();
            }).catch((err) => {
                chai_1.assert.isNotOk(err, 'failed to count addresses');
                done();
            });
        });
    });
}
exports.default = createDocuments;
