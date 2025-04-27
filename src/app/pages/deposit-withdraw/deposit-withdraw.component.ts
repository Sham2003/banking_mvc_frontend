import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  imports:[CommonModule,FormsModule]
})
export class DepositWithdrawComponent {
  accountNumber = '';
  transactionType = '';
  amount: number | null = null;

  message = '';
  error = '';
  private userService = inject(UserService);

  private snackBar = inject(MatSnackBar);

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
    if (!this.accountNumber || !this.transactionType || !this.amount) {
      this.error = 'Please fill all fields';
      this.message = '';
      return;
    }


    this.userService.depoWithdraw({
          accountNumber:this.accountNumber,
          transactionType:this.transactionType,
          amount:this.amount}).subscribe({
            next:(val) => {
              this.message = `Transaction of ₹${this.amount} (${this.transactionType}) was successful for A/C ${this.accountNumber}.`;
              this.error = '';
            },
            error:(err) => {
              this.message = "Transaction Unsuccessfull";
              this.handleError(err);
              this.error = "Error";
            }
          })
  }
}
``
