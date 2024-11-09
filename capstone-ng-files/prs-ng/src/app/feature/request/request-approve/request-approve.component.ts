import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request.class';
import { LineItem } from '../../../model/lineitem.class';
import { Product } from '../../../model/product.class';
import { User } from '../../../model/user.class';
import { Vendor } from '../../../model/vendor.class';
import { LineitemService } from '../../../service/lineitem.service';
import { ProductService } from '../../../service/product.service';
import { UserService } from '../../../service/user.service';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-request-approve',
  templateUrl: './request-approve.component.html',
  styleUrl: './request-approve.component.css',
})
export class RequestApproveComponent implements OnInit, OnDestroy {
  title: string = 'Request Approve';
  requestId!: number;
  request!: Request;
  lineitems?: LineItem[];
  products!: Product[];
  vendors!: Vendor[];
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';
  loggedUserId: number = 0;
  product!: Product;
  productInstances!: Product;
  productName!: string;
  productPrice!: number;
  vendorName!: string;
  reqUserFName!: string;
  reqUserLName!: string;
  reqUserId!: number;
  reqUser!: User;

  constructor(
    private requestSvc: RequestService,
    private lineitemSvc: LineitemService,
    private vendorSvc: VendorService,
    private userSvc: UserService,
    private productSvc: ProductService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    this.loggedUserId = this.sysSvc.loggedInUser.id;
    this.subscription = this.productSvc.list().subscribe((productList) => {
      this.products = productList;
    });
    this.subscription = this.vendorSvc.list().subscribe((vendorList) => {
      this.vendors = vendorList;
    });

    this.actRoute.params.subscribe((parms) => {
      this.requestId = +parms['requestId'];
      this.requestSvc.getById(this.requestId).subscribe({
        next: (request) => {
          this.request = request as Request;
          this.userSvc.getById(this.request.userId).subscribe({
            next: (user) => {
              this.reqUser = user;
              this.reqUserFName = this.reqUser.firstName;
              this.reqUserLName = this.reqUser.lastName;
            },
          });
        },
        error: (err) => {
          console.log('Error retrieving request: ', err);
        },
      });
      this.subscription = this.lineitemSvc
        .getRequestById(this.requestId)
        .subscribe({
          next: (resp) => {
            this.lineitems = resp;
            this.lineitems.forEach((lineitem) => {
              this.subscription = this.vendorSvc
                .getById(lineitem.product.vendorId)
                .subscribe({
                  next: (vendor) => {
                    lineitem.product.vendor = vendor;
                  },
                });
            });
          },
          error: (err) => {
            console.error(
              'Request Line Item: Error getting lineitems for request Id: ' +
                this.requestId
            );
          },
        });
    });
  }

  approve() {
    this.subscription = this.requestSvc
      .requestApprove(this.requestId, this.request)
      .subscribe({
        next: (resp) => {
          this.request = resp as Request;
          this.router.navigateByUrl('request-list');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  reject() {
    this.subscription = this.requestSvc
      .requestReject(this.requestId, this.request)
      .subscribe({
        next: (resp) => {
          this.request = resp as Request;
          this.router.navigateByUrl('request-list');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
