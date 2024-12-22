import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private headerService: HeaderService
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
      alert('Invalid form or token');
      return;
    }

    const newPassword = this.resetForm.value.newPassword;
    this.http
      .post('/auth/reset-password', { token: this.token, newPassword })
      .subscribe({
        next: () => {
          alert('Password reset successfully');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          alert('Failed to reset password');
        },
      });
  }

}
