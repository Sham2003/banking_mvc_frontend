import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    mobileNumber : new FormControl('',[Validators.required,Validators.max(10)]),
    dob: new FormControl('',[Validators.required,Validators.pattern(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)]),
    accountType: new FormControl('',[Validators.required,Validators.pattern(/(savings|current)/)]),
    password: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
  });

  private router = inject(Router);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

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

  submitRegister(){
    this.userService.register(this.registerForm.value).subscribe(
      {
        next:(value) => {
          if(value.email){
            this.snackBar.dismiss();
            this.router.navigate(['/verifyAccount'], { queryParams: { email: value.email } });
          }
        },
        error: (err) => {
          console.log(err);
          this.handleError(err);
        },
      }
    );
  }

}
