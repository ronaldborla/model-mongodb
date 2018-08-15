import Key from '../key';
/**
 * Max field
 */
declare const max: {
    callback: (value: any, key: Key, options: string[]) => boolean;
    init: () => void;
    message: (value: any, key: Key, options: string[]) => string;
    name: string;
};
export default max;
