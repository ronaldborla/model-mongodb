import { ModelJS as Base } from 'javascript-model';
import Exception from './exception';
import Key from './key';
import Schema from './schema';
import Type, { TypeConfig } from './type';
import Validator, { ValidationResult, ValidatorInterface } from './validator';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import utils from './utils';
/**
 * Import types
 */
import Id from './types/id.type';
import Password from './types/password.type';
import Permalink from './types/permalink.type';
import Timestamp from './types/timestamp.type';
/**
 * Import validators
 */
import email from './validators/email.validator';
import enumv from './validators/enum.validator';
import max from './validators/max.validator';
import min from './validators/min.validator';
import required from './validators/required.validator';

/**
 * Model JS
 */
export default class ModelJS extends Base {

  /**
   * Override Exception
   */
  public Exception: any = Exception;

  /**
   * Override Key
   */
  public Key: any = Key;

  /**
   * Override Schema
   */
  public Schema: any = Schema;

  /**
   * Override Type
   */
  public Type: any = Type;

  /**
   * ValidationResult
   */
  public ValidationResult: any = ValidationResult;

  /**
   * Validator
   */
  public Validator: any = Validator;

  /**
   * Validators
   */
  public validators: any = {};

  /**
   * The mongo client
   */
  public client: MongoClient;

  /**
   * The database
   */
  public db: Db;

  constructor() {
    super();
    this.register([
      Id,
      Password,
      Permalink,
      Timestamp
    ]);
    [email, enumv, max, min, required].forEach((validator: ValidatorInterface) => {
      this.validators[validator.name] = validator;
    });
  }

  /**
   * Close database
   */
  close(force?: boolean): Promise<this> {
    return this.client.close(force).then(() => {
      return this;
    });
  }

  /**
   * Connect to mongodb
   */
  connect(url: string, database: string, options?: MongoClientOptions): Promise<this> {
    if (!this.schemas.length) {
      this.boot();
    }
    if (!database) {
      throw new this.Exception('Database name is required');
    }
    return MongoClient.connect(url, options).then((client: MongoClient) => {
      const promises = [];
      this.client = client;
      this.db = this.client.db(database);
      utils.forEach(this.types, (type: any, name: string) => {
        if (type && type.typeConfig instanceof TypeConfig && !utils.isUndefined(type.typeConfig.boot)) {
          promises.push(type[type.typeConfig.boot](this));
        }
      });
      return Promise.all(promises).then(() => {
        return this;
      });
    });
  }
}
