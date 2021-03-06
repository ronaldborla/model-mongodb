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
 * Collection
 */
export default class Collection<T> extends Base<T> {

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
  static find(query?: FilterQuery<any>, options?: FindOneOptions, reloadOptions?: ReloadOptions): Promise<Collection<any>> {
    const collection = new this();
    return pull((this.Model.schema.modeljs.db.collection(this.collection) as MongoCollection).find(query || {}, options)).then((cursor: Cursor) => {
      if (collection.length > 0 && !utils.isUndefined(reloadOptions)) {
        return collection.reload(reloadOptions);
      }
      return collection;
    });

    /**
     * Pull next data
     */
    function pull(cursor: Cursor): Promise<Cursor> {
      return cursor.hasNext().then((next: boolean) => {
        if (next === true) {
          return cursor.next().then((data: any) => {
            if (data) {
              collection.push(data);
            }
            return pull(cursor);
          });
        } else {
          return cursor;
        }
      });
    }
  }

  /**
   * Delete multiple
   */
  delete(options?: DeleteOptions): Promise<null> {
    return utils.hook(this, 'beforeDelete').then(() => {
      return Promise.all(this.map((model: any) => {
        return (model as Model).delete(options);
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
      return Promise.all(this.map((model: any) => {
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
      return Promise.all(this.map((model: any) => {
        return (model as Model).save(options);
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
      return Promise.all(this.map((model: any) => {
        return (model as Model).validate(options);
      }));
    }).then((arrayOfValidationResults: Array<Array<ValidationResult>>) => {
      return utils.hook(this, 'afterValidate').then(() => {
        return arrayOfValidationResults;
      });
    });
  }

}
