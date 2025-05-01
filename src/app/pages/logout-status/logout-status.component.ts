import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-status',
  imports: [CommonModule, RouterLink],
  templateUrl: './logout-status.component.html',
  styleUrls: ['./logout-status.component.css']
})
export class LogoutStatusComponent implements OnInit {
  status: 'logout' | 'expired' = 'logout';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    if (type === 'expired') {
      this.status = 'expired';
    } else {
      this.status = 'logout';
    }
  }
}
