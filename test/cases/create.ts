import 'mocha';
import { assert } from 'chai';
import { address, company, date, internet, name, random } from 'faker';
import Addresses from '../src/addresses.collection';
import Companies from '../src/companies.collection';
import User from '../src/user.model';
import Users from '../src/users.collection';
import { ValidationResult } from '../../dist';

/**
 * Has char codes
 */
function hasCharCodes(text: string, low: number, high: number): boolean {
  const length = text.length;
  for (let i = 0; i < length; i++) {
    const code = text.charCodeAt(i);
    if (code >= low && code <= high) {
      return true;
    }
  }
  return false;
}

/**
 * Has leading space
 */
function hasLeadingSpace(text: string): boolean {
  return text.charAt(0) === ' ';
}

/**
 * Has lower
 */
function hasLower(text: string): boolean {
  return hasCharCodes(text, 97, 122);
}

/**
 * Has trailing space
 */
function hasTrailingSpace(text: string): boolean {
  return text.charAt(text.length - 1) === ' ';
}

/**
 * Has upper
 */
function hasUpper(text: string): boolean {
  return hasCharCodes(text, 65, 90);
}

/**
 * Create documents
 */
export default function createDocuments(config: any): void {
  const count = config.count || 100;
  describe('create documents', () => {
    const users = new Users();
    it('should validate users, companies, and addresses', (done: Function) => {
      let i = count;
      while (i-- > 0) {
        users.push({
          address: {
            city: address.city(),
            latitude: parseFloat(address.latitude()),
            longitude: parseFloat(address.longitude()),
            street: '  ' + address.streetAddress() + ' ',
            zip_code: address.zipCode(),
          },
          birth_date: date.past(50),
          company: {
            address: {
              city: address.city(),
              latitude: parseFloat(address.latitude()),
              longitude: parseFloat(address.longitude()),
              street: address.streetAddress(),
              zip_code: address.zipCode(),
            },
            name: '   ' + company.companyName() + '  '
          },
          email: ' ' + internet.email() + ' ',
          first_name: '  ' + name.firstName(),
          last_name: name.lastName() + '  ',
          password: config.user.password || internet.password(8, true),
          sex: ['male', 'female'][random.number(1)]
        });
      }
      users.validate({ depth: 2 }).then((arrayOfValidationResults: Array<Array<ValidationResult>>) => {
        const flattened = arrayOfValidationResults.map((validationResults: Array<ValidationResult>) => {
          return ValidationResult.flatten(validationResults);
        }).filter((validationResults: Array<[string, Array<string>]>) => {
          return validationResults.length > 0;
        });
        assert.strictEqual(flattened.length, 0, 'validation results must be empty');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to validate documents');
        done();
      });
    });
    it('should verify that filters are working correctly', () => {
      users.forEach((user: User) => {
        assert.isNotTrue(hasLower(user.address.city), 'City must be uppercased');
        assert.isNotTrue(hasLeadingSpace(user.address.street) || hasTrailingSpace(user.address.street), 'Street must be trimmed');
        assert.isTrue(hasLeadingSpace(user.company.name), 'Company name must have leading spaces');
        assert.isNotTrue(hasTrailingSpace(user.company.name), 'Company name must not contain any trailing spaces');
        assert.isNotTrue(hasUpper(user.email), 'Email must be lowercased');
        assert.isNotTrue(hasLeadingSpace(user.email) || hasTrailingSpace(user.email), 'City must be trimmed');
        assert.isNotTrue(hasLeadingSpace(user.first_name), 'First name must not contain any leading spaces');
        assert.isNotTrue(hasTrailingSpace(user.last_name), 'Last name must not contain any trailing spaces');
      });
    });
    it('should create users, companies, and addresses', (done: Function) => {
      users.save({ depth: 2 }).then(() => {
        assert.isOk(true, 'documents created successfully');
        done();
      }).catch((err: Error) => {
        console.log(err);
        assert.isNotOk(err, 'failed to create documents');
        done();
      });
    });
    it('should match the number of created users', (done: Function) => {
      Users.count().then((usersCount: number) => {
        assert.strictEqual(usersCount, count, 'users count mismatch');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to count users');
        done();
      });
    });
    it('should match the number of created companies', (done: Function) => {
      Companies.count().then((companiesCount: number) => {
        assert.strictEqual(companiesCount, count, 'companies count mismatch');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to count companies');
        done();
      });
    });
    it('should match the number of created addresses', (done: Function) => {
      Addresses.count().then((addressesCount: number) => {
        assert.strictEqual(addressesCount, count * 2, 'addresses count mismatch');
        done();
      }).catch((err: Error) => {
        assert.isNotOk(err, 'failed to count addresses');
        done();
      });
    });
  });
}
