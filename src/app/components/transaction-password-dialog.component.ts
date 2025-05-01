import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-transaction-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <h3 mat-dialog-title>Enter Transaction Password</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="p-3">
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Transaction Password</mat-label>
        <input matInput type="password" formControlName="password" autocomplete="off">
      </mat-form-field>
      <div class="text-end">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Submit</button>
      </div>
    </form>
  `
})
export class TransactionPasswordDialogComponent {
  dialogRef = inject(MatDialogRef<TransactionPasswordDialogComponent>);
  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password);
    }
  }
}
