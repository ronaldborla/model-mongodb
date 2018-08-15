import { compare, genSalt, hash } from 'bcrypt';
import { isString, isUndefined } from 'lodash';
import { TypeConfig } from '../type';

/**
 * Password generator
 */
export interface PasswordGenerator {
  generateHash: (password: string, salt: string) => Promise<string>;
  generateSalt: (rounds?: number) => Promise<string>;
  validate: (password: string, hash: string) => Promise<boolean>;
}

/**
 * Password hash
 */
export interface PasswordObject {
  hash: string;
  salt: string;
}

/**
 * Default generator
 */
const defaultPasswordGenerator: PasswordGenerator = {
  generateHash: (password: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      hash(password, salt, (err: Error, encrypted: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(encrypted);
        }
      });
    });
  },
  generateSalt: (rounds?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      genSalt(rounds || 10, (err: Error, salt: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(salt);
        }
      });
    });
  },
  validate: (password: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      compare(password, hash, (err: Error, same: boolean) => {
        if (err) {
          reject(err);
        } else {
          resolve(same === true);
        }
      })
    });
  },
};

/**
 * Password
 */
export default class Password {

  /**
   * Type Config
   */
  public static typeConfig: TypeConfig = new TypeConfig({
    save: 'toSave',
    validate: 'toValidate'
  });

  /**
   * The value
   */
  public value: string | PasswordObject;

  /**
   * Options
   */
  protected options: any;

  constructor(data: string | PasswordObject, options?: any) {
    this.value = data;
    this.options = options || {};
    if (isUndefined(this.options.generator)) {
      this.options.generator = defaultPasswordGenerator;
    }
    if (isUndefined(this.options.rounds)) {
      this.options.rounds = 10;
    }
  }

  /**
   * Generator
   */
  get generator(): PasswordGenerator {
    return this.options.generator;
  }

  /**
   * Validate
   */
  validate(password: string): Promise<boolean> {
    if (isString(this.value)) {
      return Promise.resolve(this.value === password);
    } else {
      return this.generator.validate(password, (this.value as PasswordObject).hash);
    }
  }

  /**
   * To object
   */
  toObject(): string | undefined {
    return this.value ? ((this.value as PasswordObject).hash || (this.value as string)) : undefined;
  }

  /**
   * To save
   */
  toSave(): Promise<PasswordObject> {
    if (isString(this.value)) {
      return this.generator.generateSalt(parseInt(this.options.rounds)).then((salt: string) => {
        return this.generator.generateHash(this.value as string, salt).then((hash: string) => {
          return this.value = {
            hash: hash,
            salt: salt
          };
        });
      });
    } else {
      return Promise.resolve(this.value as PasswordObject);
    }
  }

  /**
   * To string
   */
  toString(): string | undefined {
    return this.toValidate();
  }

  /**
   * To validate
   */
  toValidate(): string | undefined {
    return isString(this.value) ? this.value: undefined;
  }

}
