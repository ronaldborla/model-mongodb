import 'mocha';
import { assert } from 'chai';
import { isUndefined } from 'lodash';
import { ModelJS } from '../dist';

import { Collection as MongoCollection } from 'mongodb';

import Address from './src/address.model';
import Addresses from './src/addresses.collection';
import Companies from './src/companies.collection';
import Company from './src/company.model';
import User from './src/user.model';
import Users from './src/users.collection';

import caseCreate from './cases/create';
import caseRead from './cases/read';
import caseUpdate from './cases/update';
import caseDelete from './cases/delete';

const modeljs = new ModelJS();
const config = {
  count: parseInt(process.env.COUNT || '100'),
  user: {
    password: 'password'
  }
};

modeljs.register([
  Address,
  Addresses,
  Companies,
  Company,
  User,
  Users
]);

if (isUndefined(process.env.CONN)) {
  throw new Error('missing connection string on `CONN` node variable');
}
if (isUndefined(process.env.DB)) {
  throw new Error('missing database name on `DB` node variable');
}

describe('connect database', () => {
  it('should connect to the database', (done: Function) => {
    modeljs.connect(process.env.CONN, process.env.DB, {
      useNewUrlParser: true
    }).then(() => {
      return modeljs.db.collections().then((collections: Array<MongoCollection>) => {
        return Promise.all(collections.map((collection: MongoCollection) => {
          return collection.drop();
        }))
      }).then(() => {
        assert.isOk(modeljs, 'connected to the database successfully');
        done();
      });
    }).catch((err: Error) => {
      assert.isNotOk(err, 'failed to connect to the database');
      done();
    });
  });
});
[
  caseCreate,
  caseRead,
  caseUpdate,
  caseDelete
].forEach((fnCase: Function) => {
  fnCase(config);
});
describe('close database', () => {
  it('should close connection to the database', (done: Function) => {
    modeljs.close().then(() => {
      assert.isOk(modeljs, 'closed connection to the database successfully');
      done();
    }).catch((err: Error) => {
      assert.isNotOk(err, 'failed to close connection to the database');
      done();
    });
  });
});
