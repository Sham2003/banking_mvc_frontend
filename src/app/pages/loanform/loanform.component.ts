import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-loanform',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './loanform.component.html',
  styleUrl: './loanform.component.css'
})
export class LoanformComponent implements OnInit {
  loanForm: FormGroup;

  formFields = [
    { id: 'noOfDependents', label: 'Number of Dependents', type: 'number', icon: 'bi bi-people-fill', placeholder: 'e.g., 2' },
    { id: 'education', label: 'Education', type: 'text', icon: 'bi bi-mortarboard-fill', placeholder: 'e.g., Graduate' },
    { id: 'selfEmployed', label: 'Self Employed', type: 'text', icon: 'bi bi-briefcase-fill', placeholder: 'Yes or No' },
    { id: 'incomeAnnum', label: 'Income Per Annum', type: 'number', icon: 'bi bi-currency-rupee', placeholder: '₹ Annual Income' },
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', icon: 'bi bi-wallet-fill', placeholder: '₹ Loan amount' },
    { id: 'loanTerm', label: 'Loan Term (years)', type: 'number', icon: 'bi bi-calendar-range', placeholder: 'e.g., 5' },
    { id: 'cibilScore', label: 'CIBIL Score', type: 'number', icon: 'bi bi-graph-up', placeholder: '300 - 900' },
    { id: 'residentialAssetsValue', label: 'Residential Assets Value', type: 'number', icon: 'bi bi-house-fill', placeholder: '₹ Value' },
    { id: 'commercialAssetsValue', label: 'Commercial Assets Value', type: 'number', icon: 'bi bi-building', placeholder: '₹ Value' },
    { id: 'luxuryAssetsValue', label: 'Luxury Assets Value', type: 'number', icon: 'bi bi-gem', placeholder: '₹ Value' },
    { id: 'bankAssetValue', label: 'Bank Asset Value', type: 'number', icon: 'bi bi-bank2', placeholder: '₹ Bank value' }
  ];
  constructor(private fb: FormBuilder, private router: Router) {
    this.loanForm = this.fb.group({
      noOfDependents: [0, [Validators.min(0)]],
      education: ['', [Validators.required]],   // ADD Validators.required
      selfEmployed: ['', [Validators.required]], // ADD Validators.required
      incomeAnnum: [0, [Validators.required]],
      loanAmount: [0, [Validators.required]],
      loanTerm: [0, [Validators.required]],
      cibilScore: [0, [Validators.min(300), Validators.max(900)]],
      residentialAssetsValue: [0],
      commercialAssetsValue: [0],
      luxuryAssetsValue: [0],
      bankAssetValue: [0],
    });
  }
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    if(this.userService.isSessionInvalid()){
      this.router.navigate(['/status/expired']);
    }
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
    if (this.loanForm.valid) {
      console.log('Form Data:', this.loanForm.value);
      this.userService.applyLoan(this.loanForm.value).subscribe({
        next: (val) => {
          console.log(val);
          this.router.navigateByUrl('/loan-status');
          this.router.navigate(['/loan-status'], {
            state: { loanId: val }
          });
          
        },
        error: (err) => {
          this.handleError(err);
        }
      })
    } else {
      this.snackBar.openFromComponent(ErrorToastComponent, {
        duration: 4500,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        data: {
          heading:"Invalid Form",
          message:"Please fill the fields correctly"
        },
        panelClass: ['no-default-snackbar-style']
      });
    }
  }
}
