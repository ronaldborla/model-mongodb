import { TypeConfig } from '../type';

/**
 * Timestamp
 */
export default class Timestamp {

  /**
   * Type config
   */
  public static typeConfig: TypeConfig = new TypeConfig({
    default: () => {
      return new Date();
    },
    insert: 'toInsert',
    update: 'toUpdate',
    validate: 'toValidate'
  });

  /**
   * Value
   */
  public value: Date;

  /**
   * Type
   */
  public type: string;

  constructor(value: Date, options?: any) {
    options = options || {};
    this.type = options.type || 'save';
    this.value = value;
  }

  /**
   * To insert
   */
  toInsert(): Date | undefined {
    if (this.type === 'insert' || this.type === 'save') {
      return new Date();
    }
    return undefined;
  }

  /**
   * To object
   */
  toObject(): string {
    return this.value ? (this.value + '') : undefined;
  }

  /**
   * To update
   */
  toUpdate(): Date | undefined {
    if (this.type === 'update' || this.type === 'save') {
      return new Date();
    }
    return undefined;
  }

  /**
   * To validate
   */
  toValidate(): Date {
    return this.value;
  }

}
