import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-loans',
  imports:[CommonModule],
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.css']
})
export class MyLoansComponent implements OnInit {
  loans: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.userService.getLoans().subscribe({
      next: (data: any) => {
        console.log(data);
        this.loans = data || [];
      },
      error: (error) => {
        console.error('Error fetching loans:', error);
      }
    });
  }

  viewApplication(loanId: any): void {
    this.router.navigate(['/loan-status'], {
      state: { loanId: loanId }
    });
  }

  goBack(){
    this.router.navigate(['/dashboard'])
  }
}
