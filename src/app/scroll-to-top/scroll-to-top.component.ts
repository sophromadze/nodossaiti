import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
})
export class ScrollToTopComponent {
  isVisible: boolean = false;
  isMobile: boolean = false;

  constructor() {
    this.isMobile = this.checkIfMobile();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 100;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private checkIfMobile(): boolean {
    return /iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent);
  }
}
