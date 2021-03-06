import { ModelJS as Base } from 'javascript-model';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
/**
 * Model JS
 */
export default class ModelJS extends Base {
    /**
     * Attachments
     */
    attachments: {
        [key: string]: any;
    };
    /**
     * Override Exception
     */
    Exception: any;
    /**
     * Filters
     */
    filters: any;
    /**
     * Override Key
     */
    Key: any;
    /**
     * Override Schema
     */
    Schema: any;
    /**
     * Override Type
     */
    Type: any;
    /**
     * ValidationResult
     */
    ValidationResult: any;
    /**
     * Validator
     */
    Validator: any;
    /**
     * Validators
     */
    validators: any;
    /**
     * The mongo client
     */
    client: MongoClient;
    /**
     * The database
     */
    db: Db;
    constructor();
    /**
     * Attach anything
     */
    attach<T>(key: string, value?: T): this | T;
    /**
     * Close database
     */
    close(force?: boolean): Promise<this>;
    /**
     * Connect to mongodb
     */
    connect(url: string, database: string, options?: MongoClientOptions): Promise<this>;
}
