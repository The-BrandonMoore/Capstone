import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor.class';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrl: './vendor-create.component.css',
})
export class VendorCreateComponent implements OnInit, OnDestroy {
  title: string = 'Vendor Create';
  newVendor: Vendor = new Vendor();
  subscription!: Subscription;
  states: string[] = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  constructor(private vendorSvc: VendorService, private router: Router) {}
  ngOnInit(): void {}

  addVendor(): void {
    this.subscription = this.vendorSvc.add(this.newVendor).subscribe((resp) => {
      this.router.navigateByUrl('/vendor-list');
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe;
  }
}
