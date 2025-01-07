import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf
import { MatSidenavModule } from '@angular/material/sidenav';  // Import Angular Material Sidenav
import { MatListModule } from '@angular/material/list';  // Import Angular Material List
import { MatIconModule } from '@angular/material/icon';  // Import MatIconModule
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    MatSidenavModule, 
    MatListModule,
    MatIconModule
  ], 
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  userRole: string = '';
  permission: string | null = null;
  isAdmin: boolean = false;  // You can set this dynamically later
  isSuper: boolean = false;
  isAddingUser: boolean = false;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || '';
    this.permission = this.authService.getCanAddUser() || null;
    console.log(this.userRole, this.permission);

    if (this.userRole === 'Super Admin') {
      this.isSuper = true;
    }

    if (this.userRole === 'Admin') {
      this.isAdmin = true;
    }

    if(this.permission) {
      this.isAddingUser = true;
    }


  }
}
