import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private router: Router) {}

  navigateToCalculator(type: string) {
    const queryParams: any = { type };
    if (type === 'deep') {
      queryParams.deepCleaning = true;
      type = 'regular'; // Change type to 'regular' to match your condition
    }
    this.router.navigate(['/calculator'], {
      queryParams: { type, ...queryParams },
    });
  }

  scrollToCards() {
    const element = document.getElementById('cards');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
