
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { TransactionDTO, TransactionResponse } from '../../dtos/RegisterResponseDTOs';



@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule,DatePipe,FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  accountNumber: string = '';
  transactions: TransactionDTO[]  = [];
  sent = false; // Placeholder for transaction data
  private userService = inject(UserService);
  myAccountNumbers: string[] = [];
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

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
  constructor() {}

  goBack(){
    this.router.navigate(['/dashboard']);
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

  onSubmit(): void {
    if (this.accountNumber) {
      this.fetchTransactions();
    }
  }

  fetchTransactions(): void {
    this.userService.getTransactionHistory(this.accountNumber).subscribe({
      next: (value) => {
        console.log(value);
        this.transactions = value.transactionHistory;
      },
      error: (err) => {
        console.log(err);
        this.handleError(err);
      },
    })
    this.sent = true;
  }


}
