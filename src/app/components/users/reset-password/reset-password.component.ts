import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../services/header.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  token: string | null = null;
  message: string | null = null; // To store success or error messages

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Get the token from the URL
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit(): void {
    this.headerService.showHeaderAndSidenav = false;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.message = 'Invalid form or token';
      return;
    }

    const newPassword = this.resetForm.value.newPassword;
    this.authService.resetpassword(this.token, newPassword)
      .subscribe({
        next: () => {
          this.message = 'Password reset successfully.';
          setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect after 2 seconds
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          this.message = 'Failed to reset password. Please try again.';
        },
      });
  }

}
