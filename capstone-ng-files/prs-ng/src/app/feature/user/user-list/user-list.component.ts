import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user.class';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, OnDestroy {
  title: string = 'User List';
  userList: User[] | undefined;
  subscription!: Subscription;

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.subscription = this.userSvc.list().subscribe((resp) => {
      this.userList = resp;
    });
  }

  delete(id: number): void {
    this.subscription = this.userSvc.delete(id).subscribe({
      next: () => {
        // redisplay the page.
        this.subscription = this.userSvc.list().subscribe((resp) => {
          this.userList = resp;
        });
      },
      error: (error) => {
        console.error('Error deleting user for id:' + id);
        alert('Error Deleting User for ID: ' + id);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe;
  }
}
