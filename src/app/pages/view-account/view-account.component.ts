import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-view-account',
  imports: [CommonModule],
  templateUrl: './view-account.component.html',
  styleUrl: './view-account.component.css'
})
export class ViewAccountComponent implements OnInit {
  accounts: any[] = [];
  currentIndex = 0;
  private userService = inject(UserService);

  constructor(private location: Location) {}

  ngOnInit(): void {
    
    this.userService.getAccountDetails().subscribe({
      next:(value:any) => {
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
