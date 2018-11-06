import Model from './base.model';

/**
 * Users
 */
export default class User extends Model {

  public static Collection: any = 'Users';
  public static schema: any = {
    address: 'Address',
    birth_date: Date,
    company: 'Company',
    email: {
      filters: [
        'lower',
        'trim'
      ],
      type: String,
      validators: [
        'required',
        'email'
      ]
    },
    first_name: {
      filters: [
        'trim:start'
      ],
      type: String,
      validators: ['required']
    },
    last_name: {
      filters: [
        'trim:end'
      ],
      type: String,
      validators: ['required']
    },
    password: 'Password',
    sex: {
      type: String,
      validators: [{
        name: 'enum',
        options: [
          'male',
          'female'
        ]
      }]
    }
  };

  /**
   * Get full name
   */
  get full_name(): string {
    return [this.first_name, this.last_name].join(' ');
  }

}
