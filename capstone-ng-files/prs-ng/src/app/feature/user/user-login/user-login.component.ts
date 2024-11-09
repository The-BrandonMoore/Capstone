import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLogin } from '../../../model/user-login.class';
import { User } from '../../../model/user.class';
import { SystemService } from '../../../service/system.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent implements OnInit, OnDestroy {
  title: string = 'User Login';
  userLogin: UserLogin = new UserLogin();
  message?: string = undefined;
  subscription!: Subscription;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private sysSvc: SystemService
  ) {}
  ngOnInit(): void {
    //invalidate the current loggedInUser
    this.sysSvc.loggedInUser = new User();
    //could set username/password for testing purposes.
    this.userLogin.username = 'BMoore';
    this.userLogin.password = 'TestPass';
  }

  login() {
    this.subscription = this.userSvc.login(this.userLogin).subscribe({
      next: (resp) => {
        this.sysSvc.loggedInUser = resp;
        this.router.navigateByUrl('/user-list');
      },
      error: (err) => {
        this.message =
          'Invalid Username/Passowrd Combination. Please Try Again.';
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
