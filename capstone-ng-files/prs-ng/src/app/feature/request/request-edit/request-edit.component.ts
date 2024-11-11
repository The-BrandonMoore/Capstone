import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request.class';
import { LineitemService } from '../../../service/lineitem.service';
import { LineItem } from '../../../model/lineitem.class';

@Component({
  selector: 'app-request-edit',
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.css',
})
export class RequestEditComponent {
  title: string = 'Edit Request';
  requestId!: number;
  request!: Request;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';
  deliveryModeSelect: string[] = ['Standard', 'Pick-Up', 'Expedited'];
  lineitemsInRequest!: LineItem[];

  constructor(
    private router: Router,
    private lineitemSvc: LineitemService,
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

    this.actRoute.params.subscribe((parms) => {
      this.requestId = +parms['id']; // The '+' ensures it's parsed as a number
      this.subscription = this.requestSvc.getById(this.requestId).subscribe({
        next: (resp) => {
          this.request = resp;
          this.lineitemSvc.getRequestById(this.requestId).subscribe({
            next: (lineitems) => {
              this.lineitemsInRequest = lineitems;
            },
          });
        },
        error: (err) => {
          console.log('Error retrieving request: ', err);
        },
      });
    });
  }

  editRequest(id: number): void {
    this.subscription = this.requestSvc
      .editRequest(id, this.request)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('request-list');
        },
        error: (err) => {
          console.error('Error updating request:', err);
        },
      });
  }
  delete(): void {
    this.lineitemsInRequest.forEach((lineitem) => {
      this.lineitemSvc.delete(lineitem.id).subscribe();
    });
    this.subscription = this.requestSvc.delete(this.requestId).subscribe({
      next: (resp) => {
        this.request = resp as Request;
        this.router.navigateByUrl('/request-list');
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
