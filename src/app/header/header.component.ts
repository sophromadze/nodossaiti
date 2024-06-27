import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], { queryParams: { type } });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
