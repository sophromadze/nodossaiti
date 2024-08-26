import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  ngOnInit(): void {
    this.preloadBackgroundImages(); // Preload the background image
  }

  preloadBackgroundImages(): void {
    const screenWidth = window.innerWidth;
    let imageToPreload = '';

    if (screenWidth <= 1280) {
      imageToPreload = '/assets/images/city-medium.webp';
    } else {
      imageToPreload = '/assets/images/city-large.webp';
    }

    // Preload the selected image
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageToPreload;
    document.head.appendChild(link);
  }
}
