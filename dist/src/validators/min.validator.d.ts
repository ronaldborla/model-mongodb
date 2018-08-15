import Key from '../key';
/**
 * Min field
 */
declare const min: {
    callback: (value: any, key: Key, options: string[]) => boolean;
    init: () => void;
    message: (value: any, key: Key, options: string[]) => string;
    name: string;
};
export default min;
