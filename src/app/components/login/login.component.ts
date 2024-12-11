import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTabsModule],  // Import FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  phone: string = '';
  otp: string = '';
  loginError: string | null = null;
  isOtpSent: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['home']); // Redirect to dashboard on success
      },
      error: (err) => {
        this.loginError = err.error.msg;
        console.error('Login failed:', err);
      },
    });
  }

  // Send OTP
  sendOtp(): void {
    this.authService.verifyPhone(this.phone).subscribe({
      next: () => {
        this.isOtpSent = true;
        console.log('OTP sent successfully');
      },
      error: (err) => {
        this.loginError = 'Failed to send OTP.';
        console.error('Error:', err);
      },
    });
  }

  // Verify OTP
  verifyOtp(): void {
    this.authService.verifyOtp(this.phone, this.otp).subscribe({
      next: () => {
        this.router.navigate(['home']); // Redirect to dashboard on success
      },
      error: (err) => {
        this.loginError = 'Failed to verify OTP.';
        console.error('Error:', err);
      },
    });
  }

  
  
}