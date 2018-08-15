import { ObjectId } from 'mongodb';
import { TypeConfig } from '../type';
/**
 * The ID
 */
export default class Id extends ObjectId {
    /**
     * Type Config
     */
    static typeConfig: TypeConfig;
    /**
     * To object
     */
    toObject(): string;
}
