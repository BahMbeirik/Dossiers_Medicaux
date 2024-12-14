import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    
    return password?.value === confirmPassword?.value 
      ? null 
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value)
        .subscribe({
          
          next: () => {
            this.router.navigate(['/login']),
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          }
        });
    }
  }

  isFieldInvalid(field: string): boolean {
    const formField = this.registerForm.get(field);
    return !!(formField?.invalid && (formField?.dirty || formField?.touched));
  }
}