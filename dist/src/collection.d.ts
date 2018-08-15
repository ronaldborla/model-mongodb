import { Collection as Base } from 'javascript-model';
import { FilterQuery, FindOneOptions, MongoCountPreferences } from 'mongodb';
import { DeleteOptions, SaveOptions, ReloadOptions, ValidateOptions } from './model';
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
    constructor(items?: any);
    /**
     * Get collection name
     */
    static readonly collection: string;
    /**
     * Count
     */
    static count(query?: FilterQuery<any>, preferences?: MongoCountPreferences): Promise<number>;
    /**
     * Find multiple
     */
    static find(query?: FilterQuery<any>, options?: FindOneOptions, reloadOptions?: ReloadOptions): Promise<Collection>;
    /**
     * Navigate
     */
    static navigate(query?: FilterQuery<any>, options?: FindOneOptions, preferences?: MongoCountPreferences): Promise<NavigationResults>;
    /**
     * Delete multiple
     */
    delete(options?: DeleteOptions): Promise<null>;
    /**
     * Reload
     */
    reload(options?: ReloadOptions): Promise<this>;
    /**
     * Save
     */
    save(options?: SaveOptions): Promise<this>;
    /**
     * Validate
     */
    validate(options?: ValidateOptions): Promise<Array<Array<ValidationResult>>>;
}
