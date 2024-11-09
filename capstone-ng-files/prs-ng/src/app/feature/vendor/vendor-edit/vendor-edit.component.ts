import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor.class';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from '../../../service/vendor.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrl: './vendor-edit.component.css',
})
export class VendorEditComponent implements OnInit, OnDestroy {
  title: string = 'Edit Vendor';
  vendorId!: number;
  vendor!: Vendor;
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
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
    private vendorSvc: VendorService,
    private actRoute: ActivatedRoute,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    // get id from the url
    this.actRoute.params.subscribe((parms) => {
      this.vendorId = parms['id'];
    });

    // get the vendor for the id
    this.subscription = this.vendorSvc.getById(this.vendorId).subscribe({
      next: (resp) => {
        this.vendor = resp;
      },
      error: (err) => {
        console.log('Error retrieving vendor: ', err);
      },
    });
  }

  editVendor(id: number): void {
    this.subscription = this.vendorSvc.editVendor(id, this.vendor).subscribe({
      next: () => {
        this.router.navigateByUrl('vendor-list');
      },
      error: (err) => {
        console.error('Error updating vendor:', err);
      },
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
