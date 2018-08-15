import { Utils as Base } from 'javascript-model';
/**
 * Utils
 */
export declare class Utils extends Base {
    /**
     * Hook
     */
    hook<T>(instance: T, methods: Array<string> | string, index?: number): Promise<T>;
    /**
     * Check if constructor inherits another constructor
     */
    inherits(child: any, parent: any): boolean;
    /**
     * Check if promise
     */
    isPromise(variable: any): boolean;
    /**
     * Make sure that variable is a promise
     */
    when(variable: any): Promise<any>;
}
declare const utils: Utils;
export default utils;
