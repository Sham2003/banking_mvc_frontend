import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-success',
  imports: [],
  templateUrl: './account-success.component.html',
  styleUrl: './account-success.component.css'
})
export class AccountSuccessComponent implements OnInit{
  accountNumber:any
  fromComponent: any;

  constructor(private router: Router){
  }
  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state ?? window.history.state;
    this.accountNumber = state?.accNo;
    this.fromComponent = state?.from || '';
    console.log('Navigated from:', this.fromComponent);
  }

  goBack(){
    if (this.fromComponent === 'create-another-act') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']); // fallback
    }
  }
}
