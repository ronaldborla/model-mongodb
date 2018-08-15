import { ObjectId } from 'mongodb';
import { TypeConfig } from '../type';

/**
 * The ID
 */
export default class Id extends ObjectId {

  /**
   * Type Config
   */
  public static typeConfig: TypeConfig = new TypeConfig({
    validate: 'toHexString'
  });

  /**
   * To object
   */
  toObject(): string {
    return this.toHexString();
  }

}
