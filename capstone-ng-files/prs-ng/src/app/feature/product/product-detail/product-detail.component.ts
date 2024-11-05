import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  title: string = 'Product Details';
  productId!: number;
  product!: Product;
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
