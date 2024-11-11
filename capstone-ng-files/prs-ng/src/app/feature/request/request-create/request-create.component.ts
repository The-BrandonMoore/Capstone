import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { Router } from '@angular/router';
import { SystemService } from '../../../service/system.service';
import { UserService } from '../../../service/user.service';
import { Request } from '../../../model/request.class';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrl: './request-create.component.css',
})
export class RequestCreateComponent {
  title: string = 'Request Create';
  newRequest: Request = new Request();
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';
  userId: number = 0;
  deliveryModeSelect: string[] = ['Standard', 'Pick-Up', 'Expedited'];

  constructor(
    private requestSvc: RequestService,
    private router: Router,
    private userSvc: UserService,
    private sysSvc: SystemService
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
  }

  addRequest(): void {
    this.newRequest.user = this.sysSvc.loggedInUser;
    this.newRequest.userId = this.sysSvc.loggedInUser.id;
    console.log('New Request', this.newRequest);
    this.subscription = this.requestSvc.add(this.newRequest).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/request-list');
      },
      error: (err) => {
        console.error('Error creating new Request: ' + err.message);
      },
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
