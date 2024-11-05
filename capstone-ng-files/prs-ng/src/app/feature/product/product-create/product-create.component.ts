import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';
import { Vendor } from '../../../model/vendor.class';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  title: string = 'Product Create';
  newProduct: Product = new Product();
  subscription!: Subscription;
  vendors: Vendor[] = [];

  constructor(
    private productSvc: ProductService,
    private router: Router,
    private vendorSvc: VendorService
  ) {}

  ngOnInit(): void {
    this.subscription = this.vendorSvc.list().subscribe({
      next: (resp) => {
        this.vendors = resp;
      },
      error: (err) => {
        console.error(
          'Credit Create Error: error loading vendors.' + err.message
        );
      },
    });
  }

  addProduct(): void {
    //call productSvc.add method
    this.subscription = this.productSvc.add(this.newProduct).subscribe({
      next: (resp) => {
        //route/redirect to product-list component
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.error('Error creating product: ' + err.message);
      },
    });
    //forward to product-list
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe;
  }
}
