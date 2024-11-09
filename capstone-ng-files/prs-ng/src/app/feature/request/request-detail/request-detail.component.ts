import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request.class';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css',
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  title: string = 'Request Detail';
  requestId!: number;
  request!: Request;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
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
        },
        error: (err) => {
          console.log('Error retrieving request: ', err);
        },
      });
    });
  }
  delete(): void {
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

  ngOnDestroy(): void {}
}
