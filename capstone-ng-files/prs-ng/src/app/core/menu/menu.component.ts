import { Component } from '@angular/core';
import { MenuItem } from '../../model/menu-item.class';
import { SystemService } from '../../service/system.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  title: string = 'PRS-DB';
  menuItems: MenuItem[] = [];

  constructor(private sysSvc: SystemService) {}

  ngOnInit(): void {
    this.menuItems = [
      new MenuItem('User', '/user-list', 'User List'),
      new MenuItem('Vendor', '/vendor-list', 'Vendor List'),
      new MenuItem('Product', '/product-list', 'Product List'),
      new MenuItem('Request', '/request-list', 'Request List'),
    ];
    if (this.sysSvc.loggedInUser.reviewer == true) {
      this.menuItems.push(
        new MenuItem('Review', '/request-review', 'Review Requests')
      );
    }
    this.menuItems.push(new MenuItem('Login', '/user-login', 'Login'));
  }
}
