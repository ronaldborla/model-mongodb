import Model from './base.model';

/**
 * Company
 */
export default class Company extends Model {

  public static Collection: any = 'Companies';
  public static schema: any = {
    address: 'Address',
    name: {
      type: String,
      validators: ['required']
    },
    permalink: {
      options: {
        source: 'name'
      },
      type: 'Permalink'
    },
    user: 'User'
  };

}
