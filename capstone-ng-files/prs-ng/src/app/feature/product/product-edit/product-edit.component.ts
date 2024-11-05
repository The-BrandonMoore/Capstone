import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit, OnDestroy {
  title: string = 'Edit Product';
  product!: Product;
  productId!: number;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private productSvc: ProductService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
