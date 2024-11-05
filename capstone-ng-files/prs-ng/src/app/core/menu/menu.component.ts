import { Component } from '@angular/core';
import { MenuItem } from '../../model/menu-item.class';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  title: string = 'PRS-DB';
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      new MenuItem('User', '/user-list', 'User List'),
      new MenuItem('Vendor', '/vendor-list', 'Vendor List'),
      new MenuItem('Product', '/product-list', 'Product List'),
      new MenuItem('Request', '/request-list', 'Request List'),
      new MenuItem('Review', '/review-list', 'Review Requests'),
      new MenuItem('Login', '/user-login', 'User Login'),
    ];
  }
}
