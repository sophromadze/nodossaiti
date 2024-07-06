import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CardDetailsModalComponent } from './card-details/card-details.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  images: string[] = [
    '/assets/images/clean1.jpg',
    '/assets/images/clean2.jpg',
    '/assets/images/clean3.jpg',
    '/assets/images/clean4.jpg',
    // Add more image paths as needed
  ];
  currentImage: string = this.images[0];
  h2Color: string = '#fff';
  pColor: string = '#fff';

  private imageInterval: any;
  private currentIndex: number = 0;

  moveInDescription =
    'A move-in cleaning service is designed to prepare a new residence or commercial space for occupancy. It focuses on thorough cleaning to ensure the space is fresh, sanitized, and welcoming for the new occupants.';
  moveInDetails =
    'Deep Cleaning, Sanitization, Fixture Cleaning, Floor Care, Window Cleaning, Dusting, Trash Removal';

  constructor(private router: Router, private dialog: MatDialog) {}

  openServiceDetail(title: string, description: string, details: string): void {
    this.dialog.open(CardDetailsModalComponent, {
      width: '100vw', // 100% of viewport width
      height: '100vh', // 100% of viewport height
      maxWidth: '100vw', // Ensures the dialog doesn't exceed the viewport width
      maxHeight: '100vh', // Ensures the dialog doesn't exceed the viewport height
      data: {
        serviceTitle: title,
        serviceDescription: description,
        serviceDetails: details,
      },
    });
  }

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
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.currentImage = this.images[this.currentIndex];
    this.toggleTextColor();
  }

  private toggleTextColor(): void {
    if (this.currentImage === '/assets/images/clean2.jpg') {
      this.h2Color = '#000';
      this.pColor = '#000';
    } else {
      this.h2Color = '#fff';
      this.pColor = '#fff';
    }
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
}
