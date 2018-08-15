import Key from '../key';
import Model from '../model';
import ModelJS from '../index';
import { TypeConfig } from '../type';
/**
 * Permalink
 */
export default class Permalink {
    /**
     * Cache
     */
    static cache: any;
    /**
     * Is permalink
     */
    static isPermalink: boolean;
    /**
     * Type config
     */
    static typeConfig: TypeConfig;
    /**
     * Value
     */
    value: string;
    /**
     * The options
     */
    protected options: any;
    constructor(data: any, options?: any);
    /**
     * Boot
     */
    static boot(modeljs: ModelJS): Promise<ModelJS>;
    /**
     * Get cache
     */
    readonly cache: any;
    /**
     * The function to use
     */
    readonly fn: Function;
    /**
     * The key
     */
    readonly key: Key;
    /**
     * The parent
     */
    readonly parent: Model;
    /**
     * Source
     */
    readonly source: string;
    /**
     * Generate permalink
     */
    generate(): string;
    /**
     * To object
     */
    toObject(): string | undefined;
    /**
     * To string
     */
    toString(): string;
    /**
     * To validate
     */
    toValidate(): string;
}
