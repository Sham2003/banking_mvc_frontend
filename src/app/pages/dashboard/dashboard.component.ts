import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports:[CommonModule]
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) {}

  private userService = inject(UserService);

  ngOnInit(): void {
    if(this.userService.getToken() == null || this.userService.getToken().length < 4){
      alert("Please login first");
      this.router.navigate(['/login']);
    }
    console.log("Current email "+this.userService.getToken());
  }

  createAccount(){
    this.router.navigate(['/create-another-account']);
  }
  viewAccount() {
    this.router.navigate(['/view-account']);
  }

  transactionHistory() {
    this.router.navigate(['/transaction-history']);
  }

  bankTransfer() {
    this.router.navigate(['/bank-transfer']);
  }

  depoWithdraw() {
    this.router.navigate(['/depo-withdraw']);
  }

  loanApply() {
    this.router.navigate(['/loan-apply']);
  }

  viewLoans(){
    this.router.navigate(['/myloans']);
  }
  goToTPWD() {
    this.router.navigate(['/change-transaction-pwd']);
  }
}
