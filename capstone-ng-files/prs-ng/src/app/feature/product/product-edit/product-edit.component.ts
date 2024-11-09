import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Vendor } from '../../../model/vendor.class';
import { VendorService } from '../../../service/vendor.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit, OnDestroy {
  title: string = 'Edit Product';
  product!: Product;
  productId!: number;
  vendors: Vendor[] = [];
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
    private vendorSvc: VendorService,
    private productSvc: ProductService,
    private actRoute: ActivatedRoute,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    this.actRoute.params.subscribe((parms) => {
      this.productId = +parms['id']; // The '+' ensures it's parsed as a number
      this.subscription = this.productSvc.getById(this.productId).subscribe({
        next: (resp) => {
          this.product = resp;
        },
        error: (err) => {
          console.log('Error retrieving product: ', err);
        },
      });
    });
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

  editProduct(id: number): void {
    this.subscription = this.productSvc
      .editProduct(id, this.product)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('product-list');
        },
        error: (err) => {
          console.error('Error updating product: ', err);
        },
      });
  }

  delete() {
    this.subscription = this.productSvc.delete(this.productId).subscribe({
      next: (resp) => {
        this.product = resp as Product;
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  compVendor(a: Vendor, b: Vendor) {
    return a && b && a.id == b.id;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
