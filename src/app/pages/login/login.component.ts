import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  loginForm = new FormGroup({
    email:new FormControl("",[Validators.required,Validators.email]),
    password:new FormControl("",[Validators.required])
  });
  private userService = inject(UserService);


  handleError(errorObj:any){
    const heading = errorObj.error.serverErrorDescrtiption || 'Error Occurred';
    const message = errorObj.error.error || 'Something went wrong.';

    this.snackBar.openFromComponent(ErrorToastComponent, {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: {
        heading,
        message
      },
      panelClass: ['no-default-snackbar-style']
    });
  }

  submitLogin() {
    this.userService.login(this.loginForm.value as {email:string, password: string}).subscribe(
      {
        next: (data) => {
          this.userService.setToken(data.email);
          this.snackBar.dismiss();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log(err);
          this.handleError(err);
        }
      }
    )
  }
}
