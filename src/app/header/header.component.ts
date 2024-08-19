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
  logoSrc = '/assets/images/smallLogoLight.webp'; // Default logo
  isMenuOpen = false;
  isDropdownOpen = false;
  isMobile = false;

  private scrollToTopDisabled = false;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
        if (!this.scrollToTopDisabled) {
          this.scrollToTop();
        } else {
          this.scrollToTopDisabled = false;
        }
        this.scrollToFragment(); // Ensure scrolling after navigation
        this.closeMenuAndDropdown(); // Close menu and dropdown on navigation
      }
    });
    this.isMobile = this.checkIfMobile();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeMenuAndDropdown() {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    this.isScrolled = offset > 50;
  }

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], { queryParams: { type } });
    this.closeMenuAndDropdown(); // Close the dropdown after navigation
  }

  navigateToServiceSection(sectionId: string) {
    this.scrollToTopDisabled = true; // Disable scrolling to top for this navigation
    this.router
      .navigate(['/services-page'], { fragment: sectionId })
      .then(() => {
        this.scrollToFragment(); // Scroll to the fragment after navigation completes
      });
    this.closeMenuAndDropdown(); // Close the dropdown after navigation
  }

  private scrollToFragment() {
    const fragment = this.router.url.split('#')[1];
    if (fragment) {
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          const yOffset = this.isMobile ? -54 : -94; // Set yOffset based on device type
          const yPosition =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
      }, 100); // Adding a small delay ensures content is loaded before scrolling
    }
  }

  navigateToServicesDescription() {
    this.router.navigate(['/services-page']);
    this.closeMenuAndDropdown(); // Close the dropdown after navigation
  }

  private checkRoute(url: string) {
    const transparentPages = [
      '/calculator',
      '/contact',
      '/privacy-policy',
      '/services-page',
    ];
    this.isTransparentPage = transparentPages.some((page) =>
      url.includes(page)
    );
    this.updateLogo(url);
  }

  private updateLogo(url: string) {
    // Change logo based on the current route
    if (url === '/' || url === '/about' || url === 'privacy-policy') {
      this.logoSrc = '/assets/images/smallLogoLight.webp';
    } else {
      this.logoSrc = '/assets/images/smallLogoDark.webp';
    }
  }

  private scrollToTop() {
    // Scroll to the top of the page
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  private checkIfMobile(): boolean {
    return /iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent);
  }
}
