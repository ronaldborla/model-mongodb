import { Type as Base } from 'javascript-model';
/***
 * Type Config Interface
 */
export interface TypeConfigInterface {
    boot?: string;
    default?: any;
    insert?: string;
    save?: string;
    update?: string;
    validate?: string;
}
/**
 * Type Config
 */
export declare class TypeConfig {
    /**
     * Static method for boot
     */
    boot?: string;
    /**
     * Default value
     */
    default?: any;
    /**
     * Method for insert
     */
    insert?: any;
    /**
     * Method for save if insert and update are not present
     */
    save?: string;
    /**
     * Method for update
     */
    update?: string;
    /**
     * Method for validate
     */
    validate?: string;
    constructor(config: TypeConfigInterface);
}
/**
 * Type
 */
export default class Type extends Base {
}
