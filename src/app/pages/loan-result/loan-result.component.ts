import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';

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
  loanId: any;
  loanData : any ={};
  prediction: string = '';

  constructor(private router: Router,private userService:UserService) {
    const navigation = this.router.getCurrentNavigation();
    this.loanId = navigation?.extras.state?.['loanId'] as string;
    console.log(this.loanId); // 💥 see the full loan details here
  }

  ngOnInit(): void {
    // Logic for fetching the loan result can go here
    this.userService.getLoanData(this.loanId).subscribe({
      next: (val) => {
        this.loanData = val;
        this.prediction = this.loanData.approvalStatus;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  goBack(){
    this.router.navigate(['/myloans'])
  }
}
