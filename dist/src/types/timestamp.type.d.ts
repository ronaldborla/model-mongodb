import { TypeConfig } from '../type';
/**
 * Timestamp
 */
export default class Timestamp {
    /**
     * Type config
     */
    static typeConfig: TypeConfig;
    /**
     * Value
     */
    value: Date;
    /**
     * Type
     */
    type: string;
    constructor(value: Date, options?: any);
    /**
     * To insert
     */
    toInsert(): Date | undefined;
    /**
     * To object
     */
    toObject(): string;
    /**
     * To update
     */
    toUpdate(): Date | undefined;
    /**
     * To validate
     */
    toValidate(): Date;
}
