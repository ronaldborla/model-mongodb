import { replace, snakeCase } from 'lodash';
import Collection from './collection';
import Model from './model';
import Key from './key';
import utils from './utils';

/**
 * Validator interface
 */
export interface ValidatorInterface {
  block?: boolean;
  callback?: (value: any, key: Key, options?: Array<any>) => boolean | string | null | Promise<boolean | string | null>;
  init?: () => void;
  message?: string | ((value: any, key: Key, options?: Array<any>) => string | Promise<string>);
  name: string;
  options?: Array<any>;
  regex?: RegExp;
}

/**
 * ValidationResult
 */
export class ValidationResult {

  /**
   * Nested results
   */
  public child?: Array<ValidationResult> | Array<Array<ValidationResult>> = null;

  /**
   * Validated key
   */
  public key: Key;

  /**
   * Result messages
   */
  public messages: Array<string> = [];

  /**
   * The value being validated
   */
  public value: Model | Collection<Model> | any;

  constructor(data?: any) {
    ['child', 'key', 'messages', 'value'].forEach((name: string) => {
      if (!utils.isUndefined(data[name])) {
        this[name] = data[name];
      }
    });
  }

  /**
   * Flatten validation results
   */
  public static flatten(validationResults: Array<ValidationResult>, prefix?: string): Array<[string, Array<string>]> {
    const results = [];
    validationResults.forEach((result: ValidationResult) => {
      const key = prefix ? (prefix + '.' + result.key.name) : result.key.name;
      if (result.failed === true) {
        results.push([key, result.messages]);
      }
      if (result.child) {
        if (result.value instanceof Model) {
          this.flatten(result.child as Array<ValidationResult>, key).forEach((flattened: [string, Array<string>]) => {
            results.push(flattened);
          });
        } else if (result.value instanceof Collection) {
          (result.child as Array<Array<ValidationResult>>).forEach((subvalidationResults: Array<ValidationResult>, index: number) => {
            this.flatten(subvalidationResults, key + '.' + index).forEach((subflattened: [string, Array<string>]) => {
              results.push(subflattened);
            });
          });
        }
      }
    });
    return results;
  }

  /**
   * Check if failed
   */
  get failed(): boolean {
    return !this.passed;
  }

  /**
   * Check if passed
   */
  get passed(): boolean {
    return this.messages.length === 0;
  }

}

/**
 * Validator
 */
export default class Validator {

  /**
   * Block
   * Validators are executed in a series, set to true,
   * and this validator fails, it will not proceed
   * with the validator in queue
   */
  public block: boolean;

  /**
   * Callback
   * @return True if passed, false if fail, String if error,
   * null if passed or a Promise that resolves true if passed,
   * false if fail, or a string if error, null if passed,
   * rejects a string that represents the error message
   */
  public callback: (value: any, key: Key, options?: Array<any>) => boolean | string | null | Promise<boolean | string | null>;

  /**
   * The key
   */
  public key: Key;

  /**
   * Named validator
   */
  public name: string;

  /**
   * Message
   * @return String or a callback that returns a
   * string or a Promise resolving a string
   */
  public message: string | ((value: any, key: Key, options?: Array<any>) => string | Promise<string>);

  /**
   * Options
   */
  public options: Array<any>;

  /**
   * Regex
   */
  public regex: RegExp;

  constructor(key: Key, options: any) {
    this.key = key;
    ['block', 'callback', 'name', 'message', 'options', 'regex'].forEach((name: string) => {
      if (!utils.isUndefined(options[name])) {
        this[name] = options[name];
      }
    });
  }

  /**
   * Execute validation
   * @return Promise with validated value if passed,
   * otherise, a rejection with the message
   */
  execute<T>(model: Model, value: T): Promise<T> {
    const key: Key = this.key;
    return (new Promise((resolve, reject) => {
      if (utils.isFunction(this.callback)) {
        utils.when(this.callback.apply(model, [value, key, this.options])).then((result: boolean | string | null) => {
          if (result === true || result === null) {
            resolve(value);
          } else {
            reject((utils.isString(result) && result) ? result : '');
          }
        }).catch((error: any) => {
          reject((utils.isString(error) && error) ? error : '');
        });
      } else if (utils.isRegExp(this.regex)) {
        if (this.regex.test(value + '')) {
          resolve(value);
        } else {
          reject('');
        }
      }
    })).catch((message: string) => {
      if (message) {
        return Promise.reject(message);
      }
      if (utils.isString(this.message)) {
        return Promise.reject(this.message);
      }
      if (utils.isFunction(this.message)) {
        return utils.when((this.message as () => string | Promise<string>).apply(model, [value, key, this.options])).then((result: string) => {
          return errorMessage(result);
        }).catch((error: string) => {
          return errorMessage(error);
        });
      }
      return errorMessage(null);

      /**
       * Default message
       */
      function errorMessage(error: string): Promise<any> {
        if (utils.isString(error) && error) {
          return Promise.reject(error);
        }
        return Promise.reject('Validation failed for ' + replace(snakeCase(key.name), '_', ' '));
      }
    });
  }
}
