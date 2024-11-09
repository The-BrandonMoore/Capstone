import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineItem } from '../../../model/lineitem.class';
import { Subscription } from 'rxjs';
import { LineitemService } from '../../../service/lineitem.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-lineitem-edit',
  templateUrl: './lineitem-edit.component.html',
  styleUrl: './lineitem-edit.component.css',
})
export class LineitemEditComponent implements OnInit, OnDestroy {
  title: string = 'Edit Line Item';
  lineitemId!: number;
  lineitem: LineItem = new LineItem();
  products: Product[] = [];
  request?: Request;
  requestId!: number;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
    private lineitemSvc: LineitemService,
    private productSvc: ProductService,
    private requestSvc: RequestService,
    private actRoute: ActivatedRoute,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    //get lineitem ID from URL
    this.actRoute.params.subscribe((parms) => {
      this.lineitemId = +parms['lineitemId'];

      //get lineitem from ID
      this.subscription = this.lineitemSvc.getById(this.lineitemId).subscribe({
        next: (resp) => {
          this.lineitem = resp;
          this.lineitemId = this.lineitem.id;
          console.log('New Line Item - Line Item ID: ' + this.lineitem.id);
        },
      });
    });
    //fill products list
    this.subscription = this.productSvc.list().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      error: (err) => {
        console.error(
          'LineItem Create Error: error loading products.' + err.message
        );
      },
    });
  }

  save() {
    delete (this.lineitem as any).product;
    delete (this.lineitem as any).vendor;
    this.requestId = this.lineitem.requestId;
    this.subscription = this.lineitemSvc.editLineitem(this.lineitem).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/request-lineitem/' + this.requestId);
      },
      error: (err) => {
        console.error('Error updating lineitem: ' + err.message);
      },
    });
  }
  delete(): void {
    this.requestId = this.lineitem.requestId;
    this.subscription = this.requestSvc.delete(this.lineitemId).subscribe({
      next: (resp) => {
        this.lineitem = resp as LineItem;
        this.router.navigateByUrl('/request-lineitem/' + this.requestId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  compProduct(a: Product, b: Product): boolean {
    return a && b && a.id == b.id;
  }
  compQuantity(a: LineItem, b: LineItem): boolean {
    return a && b && a.quantity == b.quantity;
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
