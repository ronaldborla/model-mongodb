import { Utils as Base } from 'javascript-model';

/**
 * Utils
 */
export class Utils extends Base {

  /**
   * Hook
   */
  hook<T>(instance: T, methods: Array<string> | string, index?: number): Promise<T> {
    if (this.isArray(methods)) {
      index = index || 0;
      if (this.isUndefined(methods[index])) {
        return Promise.resolve(instance);
      }
      return this.hook(instance, methods[index]).then(() => {
        return this.hook(instance, methods, index + 1);
      });
    }
    if (this.isFunction(instance[methods as string])) {
      return instance[methods as string]();
    }
    return Promise.resolve(instance);
  }

  /**
   * Check if constructor inherits another constructor
   */
  inherits(child: any, parent: any): boolean {
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
  isPromise(variable: any): boolean {
    return (variable instanceof Promise) || (
      variable &&
      this.isObject(variable) &&
      this.isFunction(variable.then) &&
      this.isFunction(variable.catch)
    );
  }

  /**
   * Make sure that variable is a promise
   */
  when(variable: any): Promise<any> {
    return this.isPromise(variable) ? variable : Promise.resolve(variable);
  }
}

const utils = new Utils();

export default utils;
