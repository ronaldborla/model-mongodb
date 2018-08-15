import Model from './base.model';

/**
 * Address
 */
export default class Address extends Model {

  public static Collection: any = 'Addresses';
  public static schema: any = {
    city: {
      type: String,
      validators: ['required']
    },
    latitude: Number,
    longitude: Number,
    street: {
      type: String,
      validators: ['required']
    },
    zip_code: String
  };

}
