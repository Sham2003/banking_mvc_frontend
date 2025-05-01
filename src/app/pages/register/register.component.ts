import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { RegisterRequestDTO } from '../../dtos/RegisterResponseDTOs';

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
    this.checkFormValidity(this.registerForm);
    const raw = this.registerForm.getRawValue();

    const userData: RegisterRequestDTO = {
      name: raw.name ?? '',
      email: raw.email ?? '',
      mobileNumber: raw.mobileNumber ?? '',
      dob: raw.dob ?? '',
      accountType: raw.accountType as 'savings'|'current' ?? '',
      password: raw.password ?? '',
      confirmPassword: raw.confirmPassword ?? '',
    };

    this.userService.register(userData).subscribe(
      {
        next:(value) => {
            this.snackBar.dismiss();
            this.router.navigate(['/verifyAccount'], { queryParams: { email: value.email, otpReqId: value.otpReqId } });
        },
        error: (err) => {
          console.log(err);
          this.handleError(err);
        },
      }
    );
  }

  checkFormValidity(form: FormGroup): boolean {
    if (form.valid) {
      console.log('✅ Form is valid');
      return true;
    }
  
    console.log('❌ Form is invalid. Errors:');
  
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
  
      if (control && control.invalid) {
        const errors = control.errors;
        console.log(`🔹 ${key} has errors:`);
  
        if (errors?.['required']) {
          console.log(`   - ${key} is required.`);
        }
        if (errors?.['email']) {
          console.log(`   - ${key} must be a valid email.`);
        }
        if (errors?.['maxlength']) {
          console.log(`   - ${key} exceeds max length.`);
        }
        if (errors?.['minlength']) {
          console.log(`   - ${key} is too short.`);
        }
        if (errors?.['pattern']) {
          console.log(`   - ${key} has an invalid format.`);
        }
        // Add other validations if needed
      }
    });
  
    return false;
  }
  

}
