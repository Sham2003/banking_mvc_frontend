import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../service/user.service';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-another-act',
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './another-act.component.html',
  styleUrl: './another-act.component.css'
})
export class CreateAnotherAccountComponent implements OnInit {
  accountForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.accountForm = this.fb.group({
      accountType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(this.userService.isSessionInvalid()){
      this.router.navigate(['/status/expired']);
    }
  }

  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  handleError(errorObj: any) {
    const heading = errorObj.error?.serverErrorDescription || 'Error Occurred';
    const message = errorObj.error?.error || 'Something went wrong.';

    this.snackBar.openFromComponent(ErrorToastComponent, {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { heading, message },
      panelClass: ['no-default-snackbar-style']
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const accountType = this.accountForm.value.accountType;
      this.userService.createAnotherAccount(accountType).subscribe({
        next: (res) => {
          this.router.navigateByUrl('/success', { state: { accNo: res.accountNumber ,from:'create-another-act'} });
        },
        error: (err) => {
          console.error('Verification failed', err);
          this.handleError(err);
        }
      });
    }
  }
}
