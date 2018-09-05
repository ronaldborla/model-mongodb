import { Model as Base } from 'javascript-model';
import { CommonOptions, FilterQuery, FindOneOptions } from 'mongodb';
import { ValidationResult } from './validator';
/**
 * Delete options
 */
export interface DeleteOptions extends CommonOptions {
}
/**
 *  Populate options
 */
export interface PopulateOptions {
    findOptions?: FindOneOptions;
    path: string;
    populate?: Array<string | PopulateOptions>;
}
/**
 * Reload options
 */
export interface ReloadOptions {
    findOptions?: FindOneOptions;
    populate?: Array<string | PopulateOptions>;
}
/**
 * Save options
 */
export interface SaveOptions {
    depth?: number;
}
/**
 * Validate options
 */
export interface ValidateOptions {
    depth?: number;
}
/**
 * Model
 */
export default class Model extends Base {
    /**
     * Override constructor
     */
    constructor(data?: any);
    /**
     * Create Model and save to database
     * @return Promise
     */
    static create(data: any, options?: SaveOptions): Promise<Model>;
    /**
     * Find document
     */
    static find(query?: FilterQuery<any>, options?: FindOneOptions, reloadOptions?: ReloadOptions): Promise<Model>;
    /**
     * Delete one
     */
    delete(options?: DeleteOptions): Promise<null>;
    /**
     * Override load
     */
    load(data?: any): this;
    /**
     * Reload data
     * @param Reload options
     * @return Promise with model
     */
    reload(options?: ReloadOptions): Promise<this>;
    /**
     * Save data
     * @param Save options
     * @return Promise with saved model
     */
    save(options?: SaveOptions): Promise<this>;
    /**
     * Validate
     * @return Always return a resolved array of ValidationResult
     * Rejected values are critical errors
     */
    validate(options?: ValidateOptions): Promise<Array<ValidationResult>>;
}
