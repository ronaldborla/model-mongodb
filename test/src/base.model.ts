import { Model as Base } from '../../dist';

/**
 * Base Model
 */
export default class Model extends Base {

  public static Collection: any = 'Collection';
  public static schema: any = {
    created: {
      type: 'Timestamp',
      options: {
        type: 'insert'
      }
    },
    id: 'Id',
    updated: {
      type: 'Timestamp',
      options: {
        type: 'update'
      }
    }
  };

}
