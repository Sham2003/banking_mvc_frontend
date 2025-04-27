import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports:[CommonModule,FormsModule]
})
export class ForgotPasswordComponent {
  email = '';
  message = '';

  onSubmit() {
    if (!this.email) {
      this.message = 'Please enter a valid email.';
    } else {
      this.message = `OTP has been sent to ${this.email}.`;
    }
  }
}
