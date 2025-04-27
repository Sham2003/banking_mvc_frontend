// verify-activation-code.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-activation-code',
  imports:[FormsModule,CommonModule],
  templateUrl: './verify-activation-code.component.html',
  styleUrls: ['./verify-activation-code.component.css']
})
export class VerifyActivationCodeComponent implements OnInit {
  email: string = '';
  name: string = '';
  dob: string = '';
  mobileNumber: string = '';
  accountType: string = '';
  otp: string = '';

  constructor() { }

  ngOnInit(): void {
    // For demo purposes, you can set the values here or get them from a service.
    // For example:
    this.email = 'user@example.com';  // Replace with actual email from backend or service
    this.name = 'John Doe';           // Replace with actual name
    this.dob = '1990-01-01';          // Replace with actual date of birth
    this.mobileNumber = '1234567890'; // Replace with actual mobile number
    this.accountType = 'Savings';     // Replace with actual account type
  }

  onSubmit(): void {
    if (this.otp) {
      // Handle OTP verification here, you can make an API call
      console.log('Verifying OTP for email: ', this.email);
    }
  }
}
