import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
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
    
    const passwordValidators = [
      Validators.required,
      Validators.minLength(6),
      this.passwordStrengthValidator(),
    ];    
    const confirmPasswordValidators = [Validators.required];    
    const formGroupValidators = [this.matchPasswordsValidator()];
    
    this.resetForm = this.fb.group(
      {
        newPassword: ['', passwordValidators],
        confirmPassword: ['', confirmPasswordValidators],
      },
      {
        validators: formGroupValidators,
      }
    );

    // Get the token from the URL
    this.token = this.route.snapshot.paramMap.get('token');
  }

  
  ngOnInit(): void {
    this.headerService.showHeaderAndSidenav = false;
  }

  // Custom validator for password strength
  private passwordStrengthValidator(): Validators {
    return (control: AbstractControl) => {
      const value = control.value || '';
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValid = hasUpperCase && hasLowerCase && hasSpecialChar;
      return isValid ? null : { weakPassword: true };
    };
  }

   // Custom validator to match passwords
   private matchPasswordsValidator(): Validators {
    return (group: AbstractControl) => {
      const password = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
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
