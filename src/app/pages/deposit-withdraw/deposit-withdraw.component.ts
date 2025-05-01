import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  imports:[CommonModule,FormsModule]
})
export class DepositWithdrawComponent implements OnInit {
printChange() {
  console.log("Chane");
  console.log(this.accountNumber);
}
  accountNumber = '';
  transactionType = '';
  myAccountNumbers:string[] = [];
  amount: number | null = null;

  message = '';
  error = '';
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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
    if (!this.accountNumber || !this.transactionType || !this.amount) {
      console.log(" acc:" + this.accountNumber);
      console.log(" acc:" + this.transactionType);
      console.log(" acc:" + this.amount);
      this.error = 'Please fill all fields';
      this.message = '';
      return;
    }


    this.userService.depoWithdraw({
          accountNumber:this.accountNumber,
          transactionType:this.transactionType as 'deposit' | 'withdraw',
          amount:this.amount}).subscribe({
            next:() => {
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
