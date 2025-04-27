import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface LoanData {
  loanId: string;
  noOfDependents: number;
  education: string;
  selfEmployed: string;
  incomeAnnum: number;
  loanAmount: number;
  loanTerm: number;
  cibilScore: number;
  residentialAssetsValue: number;
  commercialAssetsValue: number;
  luxuryAssetsValue: number;
  bankAssetValue: number;
  approvalStatus: string;
}



@Component({
  selector: 'app-loan-result',
  imports: [CurrencyPipe],
  templateUrl: './loan-result.component.html',
  styleUrl: './loan-result.component.css'
})
export class LoanResultComponent implements OnInit {
  loanData: any;
  prediction: string;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.loanData = navigation?.extras.state?.['loanData'] as LoanData;
    this.prediction = this.loanData.approvalStatus;
    console.log(this.loanData); // 💥 see the full loan details here
  }

  ngOnInit(): void {
    // Logic for fetching the loan result can go here
  }
}
