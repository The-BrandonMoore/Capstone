import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor.class';
import { VendorService } from '../../../service/vendor.service';
import { Subscription } from 'rxjs';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent implements OnInit, OnDestroy {
  title: string = 'Vendor List';
  vendorList: Vendor[] | undefined;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private vendorSvc: VendorService,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    this.subscription = this.vendorSvc.list().subscribe((resp) => {
      this.vendorList = resp;
    });
  }
  delete(id: number): void {
    this.subscription = this.vendorSvc.delete(id).subscribe({
      next: () => {
        // redisplay the page.
        this.subscription = this.vendorSvc.list().subscribe((resp) => {
          this.vendorList = resp;
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
