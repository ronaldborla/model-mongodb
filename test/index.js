"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const dist_1 = require("../dist");
const address_model_1 = require("./src/address.model");
const addresses_collection_1 = require("./src/addresses.collection");
const companies_collection_1 = require("./src/companies.collection");
const company_model_1 = require("./src/company.model");
const user_model_1 = require("./src/user.model");
const users_collection_1 = require("./src/users.collection");
const create_1 = require("./cases/create");
const read_1 = require("./cases/read");
const update_1 = require("./cases/update");
const delete_1 = require("./cases/delete");
const modeljs = new dist_1.ModelJS();
const config = {
    count: parseInt(process.env.COUNT || '100'),
    user: {
        password: 'password'
    }
};
modeljs.register([
    address_model_1.default,
    addresses_collection_1.default,
    companies_collection_1.default,
    company_model_1.default,
    user_model_1.default,
    users_collection_1.default
]);
if (lodash_1.isUndefined(process.env.CONN)) {
    throw new Error('missing connection string on `CONN` node variable');
}
if (lodash_1.isUndefined(process.env.DB)) {
    throw new Error('missing database name on `DB` node variable');
}
describe('connect database', () => {
    it('should connect to the database', (done) => {
        modeljs.connect(process.env.CONN, process.env.DB, {
            useNewUrlParser: true
        }).then(() => {
            return modeljs.db.collections().then((collections) => {
                return Promise.all(collections.map((collection) => {
                    return collection.drop();
                }));
            }).then(() => {
                chai_1.assert.isOk(modeljs, 'connected to the database successfully');
                done();
            });
        }).catch((err) => {
            chai_1.assert.isNotOk(err, 'failed to connect to the database');
            done();
        });
    });
});
[
    create_1.default,
    read_1.default,
    update_1.default,
    delete_1.default
].forEach((fnCase) => {
    fnCase(config);
});
describe('close database', () => {
    it('should close connection to the database', (done) => {
        modeljs.close().then(() => {
            chai_1.assert.isOk(modeljs, 'closed connection to the database successfully');
            done();
        }).catch((err) => {
            chai_1.assert.isNotOk(err, 'failed to close connection to the database');
            done();
        });
    });
});
