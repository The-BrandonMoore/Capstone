import { Component, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../../model/request.class';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-request-review',
  templateUrl: './request-review.component.html',
  styleUrl: './request-review.component.css',
})
export class RequestReviewComponent implements OnInit, OnDestroy {
  title: string = 'Requests For Review';
  requestList!: Request[];
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private requestSvc: RequestService,
    private sysSvc: SystemService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
    this.subscription = this.requestSvc
      .getRequestsForReview(this.sysSvc.loggedInUser.id)
      .subscribe((resp) => {
        this.requestList = resp;
        this.requestList.forEach((request) => {
          if (!request.user) {
            this.userSvc.getById(request.userId).subscribe((user) => {
              request.user = user;
            });
          }
        });
      });

    console.log('logged in user ID: ' + this.sysSvc.loggedInUser.id);
  }

  ngOnDestroy(): void {}
}
