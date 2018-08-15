import Key from '../key';
/**
 * Field is required validator
 */
declare const required: {
    callback: (value: any, key: Key) => boolean;
    message: (value: any, key: Key) => string;
    name: string;
};
export default required;
