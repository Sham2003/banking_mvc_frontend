import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TransactionPasswordDialogComponent } from '../../components/transaction-password-dialog.component';
import { TransactionRequest } from '../../dtos/RegisterResponseDTOs';


@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  imports:[CommonModule,ReactiveFormsModule]
})
export class BankTransferComponent implements OnInit{
  transferForm: FormGroup;
  message = '';
  senderBalance = '';
  myAccountNumbers:string[] = [];
  private userService = inject(UserService);
  constructor(private fb: FormBuilder) {
    this.transferForm = this.fb.group({
      senderAccountNumber: ['', [Validators.required]],
      receiverAccountNumber: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    if(this.userService.isSessionInvalid()){
        this.router.navigate(['/status/expired']);
        return;
    }
    this.userService.getAccountNumbers().subscribe({
      next: (val) =>{
        this.myAccountNumbers = val;
      },
      error: (err) => {
        console.log(err);
        this.handleError(err);
      }
    })
  }

  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  onSubmit() {
    if (this.transferForm.invalid) {
      this.message = 'Please fix the errors in the form.';
      this.senderBalance = '';
      return;
    }

    this.dialog.open(TransactionPasswordDialogComponent).afterClosed().subscribe((password: string) => {
      if (!password) return;

      const transferData:TransactionRequest = {
        ...this.transferForm.value,
        transactionPassword: password
      };

      this.userService.initiateTransfer(transferData).subscribe({
        next: (value) => {
          this.message = `Successfully transferred ₹${transferData.amount} from A/C ${transferData.senderAccountNumber} to A/C ${transferData.receiverAccountNumber}`;
          this.senderBalance = `Balance: ₹${value.senderBalance}`;
        },
        error: (err) => {
          this.handleError(err);
        }
      });
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

  goBack(){
    this.router.navigate(['/dashboard'])
  }

  // onSubmit() {
  //   if (this.transferForm.valid) {
  //     const { senderAccountNumber, receiverAccountNumber, amount } = this.transferForm.value;
  //     console.log('Transfer Data:', this.transferForm.value);
  //     this.userService.initiateTransfer(this.transferForm.value).subscribe({
  //       next: (value) => {
  //         console.log(value);
  //         this.message = `Successfully transferred ₹${amount} from A/C ${senderAccountNumber} to A/C ${receiverAccountNumber}`;
  //         this.senderBalance = `Balance: ₹${value.senderBalance}`;
  //       },  
  //       error: (err) => {
  //         console.log(err);
  //         this.handleError(err);
  //       }
  //     })
      
      
  //   } else {
  //     this.message = 'Please fix the errors in the form.';
  //     this.senderBalance = '';
  //   }
  // }
}
