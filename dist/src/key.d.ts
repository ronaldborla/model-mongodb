import { Key as Base, Schema } from 'javascript-model';
import Model from './model';
import Type from './type';
import Validator from './validator';
/**
 * Key
 */
export default class Key extends Base {
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
     * Validate key
     * @return Promise with resolved value or rejected error messages
     */
    validate<T>(model: Model, value: T): Promise<T>;
}
