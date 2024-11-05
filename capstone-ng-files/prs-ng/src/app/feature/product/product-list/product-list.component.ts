import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  title: string = 'Product List';
  productList: Product[] | undefined;
  subscription!: Subscription;

  constructor(private productSvc: ProductService) {}

  ngOnInit(): void {
    this.subscription = this.productSvc.list().subscribe((resp) => {
      this.productList = resp;
    });
  }
  delete(id: number): void {
    this.subscription = this.productSvc.delete(id).subscribe({
      next: () => {
        // redisplay the page.
        this.subscription = this.productSvc.list().subscribe((resp) => {
          this.productList = resp;
        });
      },
      error: (error) => {
        console.error('Error deleting movie for id:' + id);
        alert('Error Deleting Movie for ID: ' + id);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
