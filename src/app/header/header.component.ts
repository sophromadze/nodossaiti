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
  logoSrc = '/assets/images/smallLogoDark.png'; // Default logo

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    if (offset > 50) {
      this.isScrolled = true;
      if (!this.isTransparentPage) {
        this.logoSrc = '/assets/images/smallLogoLight.png'; // Change logo on scroll
      }
    } else {
      this.isScrolled = false;
      this.logoSrc = '/assets/images/smallLogoDark.png'; // Revert to default logo
    }
  }

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], { queryParams: { type } });
  }

  navigateToHome() {
    this.router.navigate(['/']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  private checkRoute(url: string) {
    const transparentPages = ['/calculator', '/about'];
    this.isTransparentPage = transparentPages.some((page) =>
      url.includes(page)
    );
  }
}
