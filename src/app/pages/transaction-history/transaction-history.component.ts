
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';

interface TransactionDTO{
    id?:number,
    accountNumber:string,
    senderAccountNumber?: string | null,
    receiverAccountNumber?: string | null,
    type : "transfer" | "deposit" | "withdraw",
    amount : Number,
    description : string,
    timestamp : string
}

interface TransactionResponse{
  totalTransactions : number,
  transactionHistory : TransactionDTO[] 
}


@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule,DatePipe,FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  accountNumber: string = '';
  transactions: TransactionDTO[] = []; // Placeholder for transaction data
  private userService = inject(UserService);
  constructor() {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.accountNumber) {
      this.fetchTransactions();
    }
  }

  fetchTransactions(): void {
    this.userService.getTransactionHistory<TransactionResponse>(this.accountNumber).subscribe({
      next: (value) => {
        console.log(value);
        this.transactions = value.transactionHistory;
      },
      error(err) {
        console.log(err);
      },
    })
    this.transactions = [
      { id: 1, accountNumber: 'A10001', type: 'transfer', amount: 500, description: 'Sent to A10003', timestamp: '2025-04-22T10:00' },
      { id: 2, accountNumber: 'A10001', type: 'deposit', amount: 1000, description: 'Salary deposit', timestamp: '2025-04-21T15:30' },
      { id: 3, accountNumber: 'A10001', type: 'withdraw', amount: 200, description: 'ATM withdrawal', timestamp: '2025-04-20T18:45' }
    ];
  }
}
