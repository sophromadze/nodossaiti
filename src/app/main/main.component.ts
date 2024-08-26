import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None, // Add this line if you want styles to be global
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'your-angular-app';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit() {
    this.initializeRotatingText();
    this.preloadImagesBasedOnScreenWidth();
  }

  preloadImagesBasedOnScreenWidth() {
    const screenWidth = window.innerWidth;
    let imagesToPreload: string[] = [];

    if (screenWidth <= 640) {
      // Preload small images
      imagesToPreload = [
        '/assets/images/clean1-small.webp',
        '/assets/images/clean2-small.webp',
        '/assets/images/clean3-small.webp',
        '/assets/images/clean4-small.webp',
      ];
    } else if (screenWidth <= 1280) {
      // Preload medium images
      imagesToPreload = [
        '/assets/images/clean1-medium.webp',
        '/assets/images/clean2-medium.webp',
        '/assets/images/clean3-medium.webp',
        '/assets/images/clean4-medium.webp',
      ];
    } else {
      // Preload large images
      imagesToPreload = [
        '/assets/images/clean1-large.webp',
        '/assets/images/clean2-large.webp',
        '/assets/images/clean3-large.webp',
        '/assets/images/clean4-large.webp',
      ];
    }

    imagesToPreload.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  initializeRotatingText() {
    const words = Array.from(
      document.querySelectorAll('.word')
    ) as HTMLElement[];
    words.forEach((word) => {
      const letters = word.textContent?.split('');
      word.textContent = '';
      letters?.forEach((letter) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.className = 'letter';
        word.append(span);
      });
    });

    let currentWordIndex = 0;
    let maxWordIndex = words.length - 1;
    words[currentWordIndex].style.opacity = '1';

    let rotateText = () => {
      let currentWord = words[currentWordIndex];
      let nextWord =
        currentWordIndex === maxWordIndex
          ? words[0]
          : words[currentWordIndex + 1];

      // rotate out letters of current word
      Array.from(currentWord.children).forEach((letter, i) => {
        setTimeout(() => {
          letter.className = 'letter out';
        }, i * 80);
      });

      // reveal and rotate in letters of next word
      nextWord.style.opacity = '1';
      Array.from(nextWord.children).forEach((letter, i) => {
        letter.className = 'letter behind';
        setTimeout(() => {
          letter.className = 'letter in';
        }, 340 + i * 80);
      });

      currentWordIndex =
        currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
    };

    rotateText();
    setInterval(rotateText, 4000);
  }

  navigateToCalculator(type: string): void {
    const queryParams: any = { type };
    if (type === 'deep') {
      queryParams.deepCleaning = true;
      type = 'regular';
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
