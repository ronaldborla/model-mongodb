import { TypeConfig } from '../type';
/**
 * Password generator
 */
export interface PasswordGenerator {
    generateHash: (password: string, salt: string) => Promise<string>;
    generateSalt: (rounds?: number) => Promise<string>;
    validate: (password: string, hash: string) => Promise<boolean>;
}
/**
 * Password hash
 */
export interface PasswordObject {
    hash: string;
    salt: string;
}
/**
 * Password
 */
export default class Password {
    /**
     * Type Config
     */
    static typeConfig: TypeConfig;
    /**
     * The value
     */
    value: string | PasswordObject;
    /**
     * Options
     */
    protected options: any;
    constructor(data: string | PasswordObject, options?: any);
    /**
     * Generator
     */
    readonly generator: PasswordGenerator;
    /**
     * Validate
     */
    validate(password: string): Promise<boolean>;
    /**
     * To object
     */
    toObject(): string | undefined;
    /**
     * To save
     */
    toSave(): Promise<PasswordObject>;
    /**
     * To string
     */
    toString(): string | undefined;
    /**
     * To validate
     */
    toValidate(): string | undefined;
}
