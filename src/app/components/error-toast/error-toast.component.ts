import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.css']
})
export class ErrorToastComponent {
  symbol:string = "❌"
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:  {type?:"success" | "warning" | "error", heading: string; message: string }){
    switch(data.type){
      case 'error': this.symbol = "❌"; break;
      case 'success':this.symbol = "✔️"; break;
      case 'warning':this.symbol = "⚠️";break;
      default: this.symbol = "❌";
    }
  } 
}
