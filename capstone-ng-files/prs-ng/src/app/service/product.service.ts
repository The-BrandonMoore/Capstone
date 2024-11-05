import { Injectable } from '@angular/core';
import { Product } from '../model/product.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../model/vendor.class';

const URL = 'http://localhost:5091/api/Products';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  //get all
  list(): Observable<Product[]> {
    return this.http.get(URL) as Observable<Product[]>;
  }
  //Add product
  add(product: Product): Observable<Product> {
    return this.http.post(URL, product) as Observable<Product>;
  }

  getById(id: number): Observable<Product> {
    return this.http.get(URL + '/' + id) as Observable<Product>;
  }

  editProduct(id: number, product: Product): Observable<Product> {
    return this.http.put(URL + '/' + id, product) as Observable<Product>;
  }

  delete(id: number): Observable<any> {
    return this.http.delete(URL + '/' + id);
  }
}
