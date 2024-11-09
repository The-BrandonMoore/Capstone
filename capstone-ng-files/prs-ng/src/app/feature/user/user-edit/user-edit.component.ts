import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user.class';
import { UserService } from '../../../service/user.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {
  title: string = 'Edit User';
  userId!: number;
  user!: User;
  subscription!: Subscription;
  welcomeName: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
    private userSvc: UserService,
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
      this.userId = parms['id'];
    });

    // get the user for the id
    this.subscription = this.userSvc.getById(this.userId).subscribe({
      next: (resp) => {
        this.user = resp;
      },
      error: (err) => {
        console.log('Error retrieving user: ', err);
      },
    });
  }

  editUser(id: number): void {
    this.subscription = this.userSvc.editUser(id, this.user).subscribe({
      next: () => {
        this.router.navigateByUrl('user-list');
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
  }

  delete(): void {
    this.subscription = this.userSvc.delete(this.userId).subscribe({
      next: (resp) => {
        this.user = resp as User;
        this.router.navigateByUrl('/user-list');
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
