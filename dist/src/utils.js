"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const javascript_model_1 = require("javascript-model");
/**
 * Utils
 */
class Utils extends javascript_model_1.Utils {
    /**
     * Hook
     */
    hook(instance, methods, index) {
        if (this.isArray(methods)) {
            index = index || 0;
            if (this.isUndefined(methods[index])) {
                return Promise.resolve(instance);
            }
            return this.hook(instance, methods[index]).then(() => {
                return this.hook(instance, methods, index + 1);
            });
        }
        if (this.isFunction(instance[methods])) {
            return instance[methods]();
        }
        return Promise.resolve(instance);
    }
    /**
     * Check if constructor inherits another constructor
     */
    inherits(child, parent) {
        if (!child) {
            return false;
        }
        if (child === parent) {
            return true;
        }
        return this.inherits(this.getParent(child), parent);
    }
    /**
     * Check if promise
     */
    isPromise(variable) {
        return (variable instanceof Promise) || (this.isObject(variable) &&
            this.isFunction(variable.then) &&
            this.isFunction(variable.catch));
    }
    /**
     * Make sure that variable is a promise
     */
    when(variable) {
        return this.isPromise(variable) ? variable : Promise.resolve(variable);
    }
}
exports.Utils = Utils;
const utils = new Utils();
exports.default = utils;
