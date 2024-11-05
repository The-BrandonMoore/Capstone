import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor.class';
import { VendorService } from '../../../service/vendor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent implements OnInit, OnDestroy {
  title: string = 'Vendor List';
  vendorList: Vendor[] | undefined;
  subscription!: Subscription;

  constructor(private vendorSvc: VendorService) {}

  ngOnInit(): void {
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
