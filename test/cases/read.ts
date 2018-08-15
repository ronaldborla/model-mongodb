import 'mocha';
import { assert } from 'chai';
import { ObjectId } from 'mongodb';
import { Password, Permalink, Timestamp } from '../../dist';
import Address from '../src/address.model';
import Company from '../src/company.model';
import User from '../src/user.model';
import Users from '../src/users.collection';

/**
 * Read documents
 */
export default function readDocuments(config: any): void {
  describe('read documents', () => {
    let users: Users;
    it('should retrieve multiple users', (done: Function) => {
      Users.find({}, {
        projection: {
          _id: 1
        }
      }).then((data: Users) => {
        data.reload({ depth: 2 }).then(() => {
          users = data;
          assert.isOk(true, 'retrieved users successfully');
          done();
        }).catch((err: Error) => {
          assert.isNotOk(err, 'failed to reload users');
          done();
        });
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to retrieve users');
        done();
      });
    });
    it('should validate user password', (done: Function) => {
      users[0].password.validate(config.user.password).then((equal: boolean) => {
        assert.strictEqual(equal, true, 'user password must be valid');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to validate password');
        done();
      });
    });
    it('should verify the types of the properties of all users', () => {
      users.forEach((user: User) => {
        assert.instanceOf(user.address, Address, 'user `address` must be an instance of `Address`');
        assert.instanceOf(user.birth_date, Date, 'user `birth_date` must be an instance of `Date`');
        assert.instanceOf(user.company, Company, 'user `company` must be an instance of `Company`');
        assert.instanceOf(user.created, Timestamp, 'user `created` must be an instance of `Timestamp`');
        assert.typeOf(user.email, 'string', 'user `email` must be a string');
        assert.typeOf(user.first_name, 'string', 'user `first_name` must be a string');
        assert.instanceOf(user.id, ObjectId, 'user `id` must be an instance of `ObjectId`');
        assert.typeOf(user.last_name, 'string', 'user `last_name` must be a string');
        assert.instanceOf(user.password, Password, 'user `password` must be an instance of `Password`');
        assert.typeOf(user.sex, 'string', 'user `sex` must be a string');
      });
    });
    it('should verify the types of the properties of all companies', () => {
      users.forEach((user: User) => {
        ((company: Company) => {
          assert.instanceOf(company.address, Address, 'company `address` must be an instance of `Address`');
          assert.instanceOf(company.created, Timestamp, 'company `created` must be an instance of `Timestamp`');
          assert.instanceOf(company.id, ObjectId, 'company `id` must be an instance of `ObjectId`');
          assert.typeOf(company.name, 'string', 'company `name` must be a string');
          assert.instanceOf(company.permalink, Permalink, 'company `permalink` must be a string');
        })(user.company);
      });
    });
    it('should verify the types of the properties of all addresses', () => {
      users.forEach((user: User) => {
        [user.address, user.company.address].forEach((address: Address) => {
          assert.typeOf(address.city, 'string', 'address `city` must be a string');
          assert.instanceOf(address.created, Timestamp, 'address `created` must be an instance of `Timestamp`');
          assert.instanceOf(address.id, ObjectId, 'address `id` must be an instance of `ObjectId`');
          assert.typeOf(address.latitude, 'number', 'address `latitude` must be a number');
          assert.typeOf(address.longitude, 'number', 'address `longitude` must be a number');
          assert.typeOf(address.street, 'string', 'address `street` must be a string');
          assert.typeOf(address.zip_code, 'string', 'zip_code `street` must be a string');
        });
      });
    });
  });
}
