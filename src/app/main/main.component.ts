import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  currentImageClass: string = 'bg-0';

  private imageInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.imageInterval = setInterval(() => {
      this.changeBackgroundImage();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  private changeBackgroundImage(): void {
    this.currentIndex = (this.currentIndex + 1) % 4; // Update this number if you add more images
    this.currentImageClass = `bg-${this.currentIndex}`;
  }

  navigateToCalculator(type: string): void {
    const queryParams: any = { type };
    if (type === 'deep') {
      queryParams.deepCleaning = true;
      type = 'regular'; // Change type to 'regular' to match your condition
    }
    this.router.navigate(['/calculator'], {
      queryParams: { type, ...queryParams },
    });
  }

  scrollToCards(): void {
    const element = document.getElementById('cards');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToCities(): void {
    const element = document.getElementById('cities');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
