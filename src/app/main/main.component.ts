import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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

  isModalOpen = false;
  modalTitle = '';

  private imageInterval: any;
  private currentIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.preloadImages();
    this.imageInterval = setInterval(() => {
      this.changeBackgroundImage();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  private preloadImages(): void {
    this.images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
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

  openModal(title: string): void {
    this.modalTitle = title;
    this.isModalOpen = true;
    document.body.classList.add('no-scroll'); // Disable background scrolling
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.classList.remove('no-scroll'); // Enable background scrolling
  }
}
