import { LineItem } from './lineitem.class';
import { Vendor } from './vendor.class';

export class Product {
  id: number;
  vendorId: number;
  partNumber: string;
  name: string;
  price: number;
  unit: string;
  photoPath: string;
  lineItems: LineItem;
  vendor: Vendor;

  constructor(
    id: number = 0,
    vendorId: number = 0,
    partNumber: string = '',
    name: string = '',
    price: number = 0.0,
    unit: string = '',
    photoPath: string = '',
    lineItems: LineItem = new LineItem(),
    vendor: Vendor = new Vendor()
  ) {
    this.id = id;
    this.vendorId = vendorId;
    this.partNumber = partNumber;
    this.name = name;
    this.price = price;
    this.unit = unit;
    this.photoPath = photoPath;
    this.lineItems = lineItems;
    this.vendor = vendor;
  }
}
