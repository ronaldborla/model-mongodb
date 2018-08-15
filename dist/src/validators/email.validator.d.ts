import Key from '../key';
import Model from '../model';
/**
 * Field is email validator
 */
declare const email: {
    regex: RegExp;
    message: (model: Model, key: Key, value: any) => string;
    name: string;
};
export default email;
