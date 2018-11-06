import Model from './base.model';

/**
 * Address
 */
export default class Address extends Model {

  public static Collection: any = 'Addresses';
  public static schema: any = {
    city: {
      filters: ['upper'],
      type: String,
      validators: ['required']
    },
    latitude: Number,
    longitude: Number,
    street: {
      filters: ['trim'],
      type: String,
      validators: ['required']
    },
    zip_code: String
  };

}
