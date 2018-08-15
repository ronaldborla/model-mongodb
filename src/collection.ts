import { Collection as Base } from 'javascript-model';
import {
  Collection as MongoCollection,
  Cursor,
  FilterQuery,
  FindOneOptions,
  MongoCountPreferences,
  MongoError
} from 'mongodb';
import Model, {
  DeleteOptions,
  SaveOptions,
  ReloadOptions,
  ValidateOptions
} from './model';
import utils from './utils';
import { ValidationResult } from './validator';

/**
 * Navigation results
 */
export interface NavigationResults {
  count: number;
  results: Collection;
}

/**
 * Collection
 */
export default class Collection extends Base {

  constructor(items?: any) {
    super(items);
  }

  /**
   * Get collection name
   */
  static get collection(): string {
    return this.Model.schema.cache.collection.name;
  }

  /**
   * Count
   */
  static count(query?: FilterQuery<any>, preferences?: MongoCountPreferences): Promise<number> {
    return (this.Model.schema.modeljs.db.collection(this.collection) as MongoCollection).countDocuments(query || {}, preferences);
  }

  /**
   * Find multiple
   */
  static find(query?: FilterQuery<any>, options?: FindOneOptions, reloadOptions?: ReloadOptions): Promise<Collection> {
    const collection = new this();
    return pull((this.Model.schema.modeljs.db.collection(this.collection) as MongoCollection).find(query || {}, options)).then((cursor: Cursor) => {
      return utils.isUndefined(reloadOptions) ? collection : collection.reload(reloadOptions);
    });

    /**
     * Pull next data
     */
    function pull(cursor: Cursor): Promise<Cursor> {
      return cursor.hasNext().then((next: boolean) => {
        if (next === true) {
          return cursor.next().then((data: any) => {
            collection.push(data);
            return pull(cursor);
          });
        } else {
          return cursor;
        }
      });
    }
  }

  /**
   * Navigate
   */
  static navigate(query?: FilterQuery<any>, options?: FindOneOptions, preferences?: MongoCountPreferences): Promise<NavigationResults> {
    return this.count(query, preferences).then((count: number) => {
      if (count <= 0) {
        return {
          count: count,
          results: new this()
        };
      }
      return this.find(query, options).then((collection: Collection) => {
        return {
          count: count,
          results: collection
        };
      });
    });
  }

  /**
   * Delete multiple
   */
  delete(options?: DeleteOptions): Promise<null> {
    return utils.hook(this, 'beforeDelete').then(() => {
      return Promise.all(this.map((model: Model) => {
        return model.delete(options);
      })).then(() => {
        return null;
      });
    }).then(() => {
      return utils.hook(this, 'afterDelete').then(() => {
        return null;
      });
    });
  }

  /**
   * Reload
   */
  reload(options?: ReloadOptions): Promise<this> {
    return utils.hook(this, 'beforeReload').then(() => {
      return Promise.all(this.map((model: Model) => {
        return model.reload(options);
      })).then(() => {
        return this;
      });
    }).then(() => {
      return utils.hook(this, 'afterReload');
    });
  }

  /**
   * Save
   */
  save(options?: SaveOptions): Promise<this> {
    return utils.hook(this, 'beforeSave').then(() => {
      return Promise.all(this.map((model: Model) => {
        return model.save(options);
      })).then(() => {
        return this;
      });
    }).then(() => {
      return utils.hook(this, 'afterSave');
    });
  }

  /**
   * Validate
   */
  validate(options?: ValidateOptions): Promise<Array<Array<ValidationResult>>> {
    return utils.hook(this, 'beforeValidate').then(() => {
      return Promise.all(this.map((model: Model) => {
        return model.validate(options);
      }));
    }).then((arrayOfValidationResults: Array<Array<ValidationResult>>) => {
      return utils.hook(this, 'afterValidate').then(() => {
        return arrayOfValidationResults;
      });
    });
  }

}
