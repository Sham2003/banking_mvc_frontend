import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LoanResponse } from '../../dtos/RegisterResponseDTOs';



@Component({
  selector: 'app-loan-result',
  imports: [CurrencyPipe,CommonModule,DatePipe],
  templateUrl: './loan-result.component.html',
  styleUrl: './loan-result.component.css'
})
export class LoanResultComponent implements OnInit {
  loanId: any;
  loanData : LoanResponse | undefined;
  prediction: string = '';

  constructor(private router: Router,private userService:UserService) {
    const navigation = this.router.getCurrentNavigation();
    this.loanId = navigation?.extras.state?.['loanId'] as string;
    console.log(this.loanId); 
  }

  ngOnInit(): void {
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
