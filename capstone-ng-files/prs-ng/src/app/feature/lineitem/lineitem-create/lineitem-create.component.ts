import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineItem } from '../../../model/lineitem.class';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product.class';
import { Request } from '../../../model/request.class';
import { LineitemService } from '../../../service/lineitem.service';
import { ProductService } from '../../../service/product.service';
import { RequestService } from '../../../service/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-lineitem-create',
  templateUrl: './lineitem-create.component.html',
  styleUrl: './lineitem-create.component.css',
})
export class LineitemCreateComponent implements OnInit, OnDestroy {
  title: string = 'Create Line Item';
  newLineitem: LineItem = new LineItem();
  subscription!: Subscription;
  products: Product[] = [];
  request?: Request;
  requestId!: number;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private lineitemSvc: LineitemService,
    private productSvc: ProductService,
    private requestSvc: RequestService,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;

    this.actRoute.params.subscribe((parms) => {
      this.requestId = +parms['requestId'];

      this.subscription = this.requestSvc.getById(this.requestId).subscribe({
        next: (resp) => {
          this.request = resp;
          this.requestId = this.request.id;
          this.newLineitem.requestId = this.requestId;
          console.log(
            'New Line Item - Request ID: ' + this.newLineitem.requestId
          );
        },
      });
    });

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

  add() {
    console.log('Add LineItem', this.newLineitem);
    delete (this.newLineitem as any).product;
    this.subscription = this.lineitemSvc.add(this.newLineitem).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/request-lineitem/' + this.requestId);
      },
      error: (err) => {
        console.error('Error creating line item: ' + err.message);
      },
    });
  }

  ngOnDestroy(): void {}
}
