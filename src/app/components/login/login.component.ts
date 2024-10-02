import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Import FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;  // Add rememberMe field
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // Call login with rememberMe
    this.authService.login(this.username, this.password, this.rememberMe ? 'true' : '')
      .subscribe(
        (response: any) => {
          if (response.authh) {
            // Store auth data
            this.authService.setAuthData(response.authh, response.developers, response.projects);

            // Navigate to the dashboard (or another page)
            this.router.navigate(['/home']);
          }
        },
        error => {
          this.loginError = error.error.msg || 'Login failed. Please try again.';
        }
      );
  }
}