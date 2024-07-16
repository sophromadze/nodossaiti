import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isScrolled = false;
  isTransparentPage = false;
  logoSrc = '/assets/images/smallLogoLight.png'; // Default logo

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
        this.scrollToTop();
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    this.isScrolled = offset > 50;
  }

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], { queryParams: { type } });
  }

  private checkRoute(url: string) {
    const transparentPages = ['/calculator', '/about', '/contact'];
    this.isTransparentPage = transparentPages.some((page) =>
      url.includes(page)
    );
    this.updateLogo(url);
  }

  private updateLogo(url: string) {
    // Change logo based on the current route
    if (url === '/') {
      this.logoSrc = '/assets/images/smallLogoLight.png';
    } else {
      this.logoSrc = '/assets/images/smallLogoDark.png';
    }
  }

  private scrollToTop() {
    // Scroll to the top of the page
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
