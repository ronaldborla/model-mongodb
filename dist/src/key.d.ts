import { Key as Base, Schema } from 'javascript-model';
import Model from './model';
import Type from './type';
import Validator from './validator';
/**
 * Key Filter
 */
export interface KeyFilter {
    callback: (value: any, key: Key, options?: Array<any>) => any;
    name?: string;
    options?: Array<any>;
}
/**
 * Key
 */
export default class Key extends Base {
    /**
     * Filters
     */
    filters: Array<KeyFilter>;
    /**
     * The Type
     */
    type: Type;
    /**
     * Validators
     */
    validators: Array<Validator>;
    /**
     * Override constructor
     */
    constructor(schema: Schema, name: string, object: any);
    /**
     * Override cast
     */
    cast(model: Model, value: any): any;
    /**
     * Load filters
     */
    loadFilters(filters: Array<any>): this;
    /**
     * Load validators
     */
    loadValidators(validators: Array<any>): this;
    /**
     * Validate key
     * @return Promise with resolved value or rejected error messages
     */
    validate<T>(model: Model, value: T): Promise<T>;
}
