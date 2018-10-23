import { deburr, get, isFunction, isObject, isString, isUndefined, trim } from 'lodash';
import { ObjectId } from 'mongodb';
import Collection from '../collection';
import Exception from '../exception';
import Key from '../key';
import Model from '../model';
import ModelJS from '../index';
import Schema from '../schema';
import { TypeConfig } from '../type';

/**
 * Cast to permalink
 */
function cast(text: string): string {
  return trim(deburr(text)
    .replace(/["'`]/g, '')
    .replace(/[^A-Za-z0-9]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase(), '-');
}

/**
 * Permalink
 */
export default class Permalink {

  /**
   * Cache
   */
  public static cache: any = {};

  /**
   * Is permalink
   */
  public static isPermalink = true;

  /**
   * Type config
   */
  public static typeConfig: TypeConfig = new TypeConfig({
    boot: 'boot',
    default: '',
    save: 'generate',
    validate: 'toValidate'
  });

  /**
   * Value
   */
  public value: string;

  /**
   * The options
   */
  protected options: any;

  constructor(data: any, options?: any) {
    if (!isObject(options)) {
      throw new Exception('Missing options for permalink type');
    }
    if (isUndefined(options.key)) {
      throw new Exception('Missing key for permalink type');
    }
    if (isUndefined(options.parent)) {
      throw new Exception('Missing model instance for permalink type');
    }
    this.options = options;
    if (isUndefined(this.options.source)) {
      this.options.source = ((this.options.parent.constructor as typeof Model).schema.cache.index as Key).name;
    }
    if (!isFunction(this.options.fn)) {
      this.options.fn = cast;
    }
    if (isString(data)) {
      this.value = data;
    }
  }

  /**
   * Boot
   */
  public static boot(modeljs: ModelJS): Promise<ModelJS> {
    const promises = [];
    this.cache = {};
    modeljs.schemas.forEach((schema: Schema) => {
      const projection = {};
      schema.keys.forEach((key: Key) => {
        if (key.type.Constructor.isPermalink === true) {
          if (isUndefined(this.cache[schema.Model.name])) {
            this.cache[schema.Model.name] = {};
          }
          this.cache[schema.Model.name][key.name] = {};
          projection[key.name] = 1;
        }
      });
      promises.push(schema.Model.Collection.find({}, {
        projection: projection
      }).then((collection: Collection<Model>) => {
        collection.forEach((item: Model) => {
          Object.keys(projection).forEach((key: string) => {
            if (item[key] instanceof Permalink) {
              this.cache[schema.Model.name][key][item[key].value] = true;
            }
          });
        });
        return true;
      }));
    });
    return Promise.all(promises).then(() => {
      return modeljs;
    });
  }

  /**
   * Get cache
   */
  get cache(): any {
    const cache = (this.constructor as typeof Permalink).cache,
          name = (this.parent.constructor as any).name;
    if (isUndefined(cache[name])) {
      cache[name] = {};
    }
    if (isUndefined(cache[name][this.key.name])) {
      cache[name][this.key.name] = {};
    }
    return cache[name][this.key.name];
  }

  /**
   * The function to use
   */
  get fn(): Function {
    return this.options.fn;
  }

  /**
   * The key
   */
  get key(): Key {
    return this.options.key as Key;
  }

  /**
   * The parent
   */
  get parent(): Model {
    return this.options.parent as Model;
  }

  /**
   * Source
   */
  get source(): string {
    return this.options.source;
  }

  /**
   * Generate permalink
   */
  generate(): string {
    const cache = this.cache,
          source = get(this.parent, this.source);
    if (isUndefined(source)) {
      return this.value = undefined;
    }
    if (this.value && !isUndefined(cache[this.value])) {
      delete cache[this.value];
    }
    const permalink = this.fn((source instanceof ObjectId) ? source.toHexString() : (source + ''));
    let generated = permalink,
        index = 1;
    while (cache[generated] === true) {
      generated = permalink + '-' + (++index);
    }
    cache[generated] = true;
    return this.value = generated;
  }

  /**
   * To object
   */
  toObject(): string | undefined {
    return this.value;
  }

  /**
   * To string
   */
  toString(): string {
    return this.toValidate() || '';
  }

  /**
   * To validate
   */
  toValidate(): string {
    return this.value;
  }

}
