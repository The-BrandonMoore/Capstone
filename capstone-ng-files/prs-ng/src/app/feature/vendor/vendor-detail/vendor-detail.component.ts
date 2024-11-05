import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor.class';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrl: './vendor-detail.component.css',
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  title: string = 'Vendor Details';
  vendorId!: number;
  vendor!: Vendor;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private vendorSvc: VendorService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.params.subscribe((parms) => {
      this.vendorId = +parms['id']; // The '+' ensures it's parsed as a number
      this.subscription = this.vendorSvc.getById(this.vendorId).subscribe({
        next: (resp) => {
          this.vendor = resp;
        },
        error: (err) => {
          console.log('Error retrieving vendor: ', err);
        },
      });
    });
  }

  delete(): void {
    this.subscription = this.vendorSvc.delete(this.vendorId).subscribe({
      next: (resp) => {
        this.vendor = resp as Vendor;
        this.router.navigateByUrl('/vendor-list');
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
