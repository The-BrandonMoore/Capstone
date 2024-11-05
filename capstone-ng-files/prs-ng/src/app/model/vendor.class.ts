export class Vendor {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  email: string;

  constructor(
    id: number = 0,
    code: string = '',
    name: string = '',
    address: string = '',
    city: string = '',
    state: string = '',
    zip: string = '',
    phoneNumber: string = '',
    email: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.phoneNumber = phoneNumber;
    this.email = email;
  }
}
