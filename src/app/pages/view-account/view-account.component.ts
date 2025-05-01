import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../service/user.service';
import { AccountInfo } from '../../dtos/RegisterResponseDTOs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-account',
  imports: [CommonModule],
  templateUrl: './view-account.component.html',
  styleUrl: './view-account.component.css'
})
export class ViewAccountComponent implements OnInit {
  accounts: AccountInfo[] = [];
  currentIndex = 0;
  private userService = inject(UserService);
  private router = inject(Router);
  constructor(private location: Location) {}

  ngOnInit(): void {
    if(this.userService.isSessionInvalid()){
      this.router.navigate(['/status/expired']);
      return;
    }
    this.userService.getAccountDetails().subscribe({
      next:(value) => {
        this.accounts = value;
        this.currentIndex = 0;
      },
      error(err) {
        console.log(err);
      },
    })
  }

  next(): void {
    if (this.currentIndex < this.accounts.length - 1) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }


  goBack(): void {
    this.location.back();
  }
}
