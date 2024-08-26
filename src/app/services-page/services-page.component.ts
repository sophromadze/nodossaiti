import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../services/device-detector.service';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
})
export class ServicesPageComponent {
  isMobileDevice: boolean = false;

  constructor(
    private router: Router,
    private deviceDetector: DeviceDetectorService
  ) {}

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], { queryParams: { type } });
  }

  ngOnInit(): void {
    this.preloadServiceImages();
    this.isMobileDevice = this.deviceDetector.isMobile();
  }

  preloadServiceImages(): void {
    const imagesToPreload = [
      '/assets/images/regular2-medium.webp',
      '/assets/images/deep2-medium.webp',
      '/assets/images/moveIn2-medium.webp',
      '/assets/images/moveOut-medium.webp',
      '/assets/images/renovation-medium.webp',
      '/assets/images/custom-medium.webp',
    ];

    imagesToPreload.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}
