import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../device-detector.service';

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
    this.isMobileDevice = this.deviceDetector.isMobile();
  }
}
