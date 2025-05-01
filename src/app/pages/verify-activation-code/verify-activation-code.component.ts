import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-verify-activation-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-activation-code.component.html',
  styleUrls: ['./verify-activation-code.component.css']
})
export class VerifyActivationCodeComponent implements OnInit {

  otpForm: FormGroup;
  email: string = '';
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  otpReqId: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.otpReqId = params['otpReqId'] || '';
    });
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

  getOtp(): string {
    const { digit1, digit2, digit3, digit4, digit5, digit6 } = this.otpForm.value;
    return `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
  }

  verifyEmail() {
    const otp = this.getOtp();

    this.userService.authenticate(this.email,this.otpReqId, otp).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/success',{state:{accNo:res.accountNumber,from:'register'}})
      },
      error: (err) => {
        console.error('Verification failed', err);
        console.log(err);
        this.handleError(err);
      }
    });
  }

  handleFocus(event: any, nextInput: HTMLInputElement | null) {
    if (event.target.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  handleBackspace(event: KeyboardEvent, previousInput: HTMLInputElement | null) {
    if (event.key === 'Backspace' && previousInput) {
      previousInput.focus();
    }
  }
}
