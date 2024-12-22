import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  email: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  
  // Resend OTP countdown
  resendCountdown = 0;
  isResendDisabled = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [
        Validators.required, 
        Validators.pattern(/^\d{6}$/)
      ]]
    });

    // Get email from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'] || '';
  }

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['/home']);
    }

    if (!this.email) {
      // Redirect to login if no email
      this.router.navigate(['/login']);
    }
    this.startResendCountdown();
  }

  formatOTP(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove non-digit characters
    input.value = input.value.replace(/\D/g, '');
  }

  isOTPInvalid(): boolean {
    const otpControl = this.otpForm.get('otp');
    return !!(otpControl?.invalid && (otpControl?.dirty || otpControl?.touched));
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.verifyOTP({
        email: this.email,
        otp: this.otpForm.value.otp
      }).subscribe({
        next: (response) => {
          
          this.authService.setTokens({
            access: response.access,
            refresh: response.refresh,
          });
        
          // Navigate to dashboard or home
          this.router.navigate(['/home']);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'OTP verification failed';
        }
      });
    }
  }

  startResendCountdown() {
    this.resendCountdown = 120; // 60 seconds
    this.isResendDisabled = true;

    const timer = setInterval(() => {
      this.resendCountdown--;
      
      if (this.resendCountdown <= 0) {
        clearInterval(timer);
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  resendOTP() {
    if (this.isResendDisabled) return;

    this.authService.login({ 
      email: this.email, 
      // We'll reuse the login endpoint to generate a new OTP
      password: '' // This would typically come from a stored/remembered password
    }).subscribe({
      next: () => {
        this.startResendCountdown();
        // Optional: Show a success message
      },
      error: (error) => {
        this.errorMessage = 'Failed to resend OTP. Please try again.';
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
