import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { Request } from '../../../model/request.class';
import { SystemService } from '../../../service/system.service';
import { User } from '../../../model/user.class';
import { Router } from '@angular/router';
@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css',
})
export class RequestListComponent implements OnInit, OnDestroy {
  title: string = 'Request List';
  requestList: Request[] = [];
  subscription!: Subscription;
  user!: User;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private requestSvc: RequestService,
    private sysSvc: SystemService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;

    this.subscription = this.requestSvc.list().subscribe((resp) => {
      this.requestList = resp;
    });
  }
  delete(id: number): void {
    this.subscription = this.requestSvc.delete(id).subscribe({
      next: () => {
        // redisplay the page.
        this.subscription = this.requestSvc.list().subscribe((resp) => {
          this.requestList = resp;
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
