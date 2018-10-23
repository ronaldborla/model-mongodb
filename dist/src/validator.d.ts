import Collection from './collection';
import Model from './model';
import Key from './key';
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
export declare class ValidationResult {
    /**
     * Nested results
     */
    child?: Array<ValidationResult> | Array<Array<ValidationResult>>;
    /**
     * Validated key
     */
    key: Key;
    /**
     * Result messages
     */
    messages: Array<string>;
    /**
     * The value being validated
     */
    value: Model | Collection<Model> | any;
    constructor(data?: any);
    /**
     * Flatten validation results
     */
    static flatten(validationResults: Array<ValidationResult>, prefix?: string): Array<[string, Array<string>]>;
    /**
     * Check if failed
     */
    readonly failed: boolean;
    /**
     * Check if passed
     */
    readonly passed: boolean;
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
    block: boolean;
    /**
     * Callback
     * @return True if passed, false if fail, String if error,
     * null if passed or a Promise that resolves true if passed,
     * false if fail, or a string if error, null if passed,
     * rejects a string that represents the error message
     */
    callback: (value: any, key: Key, options?: Array<any>) => boolean | string | null | Promise<boolean | string | null>;
    /**
     * The key
     */
    key: Key;
    /**
     * Named validator
     */
    name: string;
    /**
     * Message
     * @return String or a callback that returns a
     * string or a Promise resolving a string
     */
    message: string | ((value: any, key: Key, options?: Array<any>) => string | Promise<string>);
    /**
     * Options
     */
    options: Array<any>;
    /**
     * Regex
     */
    regex: RegExp;
    constructor(key: Key, options: any);
    /**
     * Execute validation
     * @return Promise with validated value if passed,
     * otherise, a rejection with the message
     */
    execute<T>(model: Model, value: T): Promise<T>;
}
