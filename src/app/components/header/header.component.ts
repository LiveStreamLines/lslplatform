import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // Import the AuthService

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username: string = 'Admin';  // You can replace this with dynamic user data

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();  // Call the logout function in AuthService
  }
}
