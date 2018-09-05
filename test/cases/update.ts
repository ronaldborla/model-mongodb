import 'mocha';
import { assert } from 'chai';
import Address from '../src/address.model';
import Company from '../src/company.model';
import Companies from '../src/companies.collection';
import { Timestamp } from '../../dist';
import User from '../src/user.model';
import Users from '../src/users.collection';

/**
 * Update documents
 */
export default function updateDocuments(config: any): void {
  describe('update documents', () => {
    it('should update companies with corresponding users', (done: Function) => {
      Users.find({}, {
        projection: {
          _id: 1,
          company: 1
        }
      }).then((users: Users) => {
        Promise.all(users.map((user: User) => {
          return Company.find({
            _id: user.company.id
          }, {
            projection: {
              _id: 1
            }
          }).then((company: Company) => {
            company.user = user.id;
            return company;
          });
        })).then((arr: Array<Company>) => {
          const companies = new Companies(arr);
          companies.save().then(() => {
            assert.isOk(true, 'companies updated successfully');
            done();
          }).catch((err: Error) => {
            assert.isNotOk(err, 'failed to update companies');
            done();
          });
        }).catch((err: Error) => {
          assert.isNotOk(err, 'failed to load companies');
          done();
        });
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to load users');
        done();
      });
    });
    it('should validate the users associated to the companies', (done: Function) => {
      Companies.find({}, {
        projection: {
          _id: 1
        }
      }, {
        populate: [
          'address',
          {
            path: 'user',
            populate: [
              'address'
            ]
          }
        ]
      }).then((companies: Companies) => {
        companies.forEach((company: Company) => {
          assert.instanceOf(company.user, User, 'company `user` must be an instance of `User`');
          assert.instanceOf(company.address, Address, 'company `address` must be an instance of `Address`');
          assert.instanceOf(company.user.address, Address, 'company user `address` must be an instance of `Address`');
          assert.instanceOf(company.updated, Timestamp, 'company `updated` must be an instance of `Timestamp`');
        });
        done();
      });
    });
  });
}
