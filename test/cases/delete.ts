import 'mocha';
import { assert } from 'chai';
import Address from '../src/address.model';
import Addresses from '../src/addresses.collection';
import Company from '../src/company.model';
import Companies from '../src/companies.collection';
import User from '../src/user.model';
import Users from '../src/users.collection';

/**
 * Delete documents
 */
export default function deleteDocuments(config: any): void {
  describe('delete documents', () => {
    it('should delete one user', (done: Function) => {
      User.find().then((user: User) => {
        user.delete().then(() => {
          assert.isOk(true, 'user successfully deleted');
          done();
        }).catch((err: Error) => {
          assert.isNotOk(err, 'failed to delete user');
          done();
        });
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to retrieve user');
        done();
      });
    });
    it('should verify that there are ' + (config.count - 1) + ' users left', (done: Function) => {
      Users.count().then((count: number) => {
        assert.strictEqual(count, config.count - 1, 'remaining users count must match');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to count users');
        done();
      });
    });
    [{
      collection: Users,
      model: User,
      name: 'users'
    }, {
      collection: Companies,
      model: Company,
      name: 'companies'
    }, {
      collection: Addresses,
      model: Address,
      name: 'addresses'
    }].forEach((item: { collection: any, model: any, name: string }) => {
      it('should delete all ' + item.name, (done: Function) => {
        item.collection.find({}, {
          projection: {
            _id: 1
          }
        }).then((collection: any) => {
          collection.delete().then(() => {
            assert.isOk(true, item.name + ' deleted successfully');
            done();
          }).catch((err: Error) => {
            assert.isNotOk(err, 'failed to delete ' + item.name);
            done();
          });
        });
      });
      it('should verify that there are no more ' + item.name + ' left', (done: Function) => {
        item.collection.count().then((count: number) => {
          assert.strictEqual(count, 0, 'remaining ' + item.name + ' must be 0');
          done();
        }).catch((err: Error) => {
          assert.isNotOk(err, 'failed to count ' + item.name);
          done();
        });
      });
    });
  });
}
