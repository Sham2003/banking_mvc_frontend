import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
  // Adjust path as necessary

@Component({
  selector: 'app-forgot-password',
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = '';
  message: string = '';
  otpsent: boolean = false;
  otpreqid: string = '';
  otp: string = '';
  passwordForm: FormGroup;
  private snackBar = inject(MatSnackBar);
  constructor(private fb: FormBuilder, private userService: UserService,private router:Router) {
    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],  // OTP must be 6 digits
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // New password
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],  // Confirm password
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.otpsent) {
      if (this.passwordForm.valid) {
        const { otp, newPassword, confirmPassword } = this.passwordForm.value;
        
        if (newPassword === confirmPassword) {
          const payload = {
            email:this.email,
            reqId:this.otpreqid,
            otp:otp,
            newPassword:newPassword,
            confirmPassword:confirmPassword
          };
          this.userService.resetPassword(payload).subscribe({
            next: (res) => {
              this.snackBar.openFromComponent(ErrorToastComponent, {
                    duration: 4500,
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    data: {
                      type: "success",
                      heading: "Password Reset Successfull",
                      message: "Try your new password"
                    },
                    panelClass: ['no-default-snackbar-style']
                  });
              this.router.navigateByUrl('/login');
            },
            error: (err) => {
              console.log(err);
              this.message = 'Error resetting password. Please try again.';
            }
          });
        } else {
          this.message = 'Passwords do not match!';
        }
      }
    } else {

      this.userService.sendForgotOtp(this.email).subscribe({
        next: (res) => {
          console.log(res);
          this.otpreqid = res;
          this.otpsent = true;
          this.message = 'OTP sent to your email!';
        },
        error: (err) => {
          console.log(err);
          this.message = 'Error sending OTP. Please try again.';
        }
      });
    }
  }

  get otpControl() {
    return this.passwordForm.get('otp');
  }

  get newPasswordControl() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }
}
