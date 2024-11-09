import { Product } from './product.class';
import { Request } from './request.class';

export class LineItem {
  id: number;
  requestId: number;
  product: Product;
  productId: number;

  quantity: number;

  constructor(
    id: number = 0,
    requestId: number = 0,

    productId: number = 0,
    product: Product = new Product(),
    quantity: number = 0
  ) {
    this.id = id;
    this.requestId = requestId;
    this.product = product;
    this.productId = productId;

    this.quantity = quantity;
  }
}
