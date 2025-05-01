import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-change-transaction-pwd',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './change-transaction-pwd.component.html',
  styleUrl: './change-transaction-pwd.component.css'
})
export class ChangeTransactionPwdComponent implements OnInit {
  accountNumber: string = '';
  message: string = '';
  otpsent: boolean = false;
  myAccountNumbers : string[] = [];
  otpreqid: string = '';
  otp: string = '';
  passwordForm: FormGroup;
  private snackBar = inject(MatSnackBar);
  constructor(private fb: FormBuilder, private userService: UserService,private router:Router) {
    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      transactionPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if(this.userService.isSessionInvalid()){
      this.router.navigate(['/status/expired']);
      return;
    }
    this.userService.getAccountNumbers().subscribe({
      next: (val) =>{
        this.myAccountNumbers = val as string[];
      },
      error: (err) => {
        console.log(err);
        this.handleError(err);
      }
    })
  }

  handleError(errorObj:any){
    const heading = errorObj.error.serverErrorDescrtiption || 'Error Occurred';
    const message = errorObj.error.error || 'Something went wrong.';

    this.snackBar.openFromComponent(ErrorToastComponent, {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: {
        heading,
        message
      },
      panelClass: ['no-default-snackbar-style']
    });
  }

  onSubmit() {
    if(this.otpsent){
      if (this.passwordForm.valid) {
          this.message = '';
            const { otp, transactionPassword } = this.passwordForm.value;
            const payload = {
              accountNumber:this.accountNumber,
              otpReqId:this.otpreqid,
              otp:otp,
              transactionPassword:transactionPassword
            };

            console.log(payload);
          
              
            this.userService.resetTPwd(payload).subscribe({
              next: () => {
                this.snackBar.openFromComponent(ErrorToastComponent, {
                      duration: 4500,
                      horizontalPosition: 'end',
                      verticalPosition: 'top',
                      data: {
                        type: "success",
                        heading: `Password Reset Successfull for ${this.accountNumber}`,
                        message: ""
                      },
                      panelClass: ['no-default-snackbar-style']
                    });
                this.router.navigateByUrl('/dashboard');
              },
              error: (err) => {
                console.log(err);
                this.message = 'Error resetting password. Please try again.';
              }
            });
      } else{
        this.message = 'Fields are invalid';
      }
    }else{
      this.userService.sendTPwdOtp(this.accountNumber).subscribe({
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
}
