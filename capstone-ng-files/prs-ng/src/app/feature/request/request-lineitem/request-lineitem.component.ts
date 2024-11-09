import { Component, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../../model/request.class';
import { LineItem } from '../../../model/lineitem.class';
import { forkJoin, map, Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { LineitemService } from '../../../service/lineitem.service';
import { VendorService } from '../../../service/vendor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from '../../../service/system.service';
import { Product } from '../../../model/product.class';
import { ProductService } from '../../../service/product.service';
import { User } from '../../../model/user.class';
import { UserService } from '../../../service/user.service';
import { Vendor } from '../../../model/vendor.class';

@Component({
  selector: 'app-request-lineitem',
  templateUrl: './request-lineitem.component.html',
  styleUrl: './request-lineitem.component.css',
})
export class RequestLineitemComponent implements OnInit, OnDestroy {
  title: string = 'Request Line-Items';
  request: Request = new Request();
  lineitems?: LineItem[];
  products!: Product[];
  vendors!: Vendor[];
  requestId!: number;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';
  loggedUserId: Number = 0;
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

    this.subscription = this.productSvc.list().subscribe((resp) => {
      this.products = resp;
    });
    this.subscription = this.vendorSvc.list().subscribe((resp) => {
      this.vendors = resp;
    });

    this.subscription = this.actRoute.params.subscribe({
      next: (parms) => {
        this.requestId = parms['id'];
        this.requestSvc.getById(this.requestId).subscribe({
          next: (request) => {
            this.request = request as Request;

            console.log('request: ' + this.request);
            this.userSvc.getById(this.request.userId).subscribe({
              next: (user) => {
                this.reqUser = user;
                this.reqUserFName = this.reqUser.firstName;
                this.reqUserLName = this.reqUser.lastName;
              },
            });
          },
          error: (err) => {
            console.error(
              'Request Line Item: Error getting request for Id: ' +
                this.requestId
            );
          },
        });

        //get lineitems for the request.
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
      },
    });
  }

  delete(id: number) {
    this.subscription = this.lineitemSvc.delete(id).subscribe({
      next: () => {
        this.subscription = this.productSvc.list().subscribe((resp) => {
          this.products = resp;
        });
        this.subscription = this.vendorSvc.list().subscribe((resp) => {
          this.vendors = resp;
        });

        this.subscription = this.actRoute.params.subscribe({
          next: (parms) => {
            this.requestId = parms['id'];
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
                console.error(
                  'Request Line Item: Error getting request for Id: ' +
                    this.requestId
                );
              },
            });

            //get lineitems for the request.
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
          },
        });
      },
    });
  }

  submitForReview() {
    this.subscription = this.requestSvc
      .submitForReview(this.requestId, this.request)
      .subscribe({
        next: (resp) => {
          this.router.navigateByUrl('/request-list');
        },
        error: (err) => {
          console.error('Error submitting request for review: ' + err.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
