import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user.class';
import { UserService } from '../../../service/user.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  title: string = 'User Create';
  newUser: User = new User();
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private userSvc: UserService,
    private sysSvc: SystemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.loggedUserName =
      this.sysSvc.loggedInUser.firstName +
      ' ' +
      this.sysSvc.loggedInUser.lastName;
  }

  addUser(): void {
    //call userSvc.add method
    this.subscription = this.userSvc.add(this.newUser).subscribe((resp) => {
      //route/redirect to user-list component
      this.router.navigateByUrl('/user-list');
    });
    //forward to user-list
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe;
  }
}
