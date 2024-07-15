import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private activateSliderHandler: any;

  constructor(private router: Router, private renderer: Renderer2) {
    this.activateSliderHandler = this.activateSlider.bind(this);
  }

  ngOnInit() {
    this.startAutoSlide();
    document.addEventListener('click', this.activateSliderHandler, false);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    document.removeEventListener('click', this.activateSliderHandler, false);
  }

  activateSlider(e: any) {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.item');
    if (e.target.matches('.next')) {
      slider!.append(items[0]);
    } else if (e.target.matches('.prev')) {
      slider!.prepend(items[items.length - 1]);
    }
  }

  navigateToCalculator() {
    this.router.navigate(['/calculator']);
  }

  startAutoSlide() {
    const slider = document.querySelector('.slider');
    this.intervalId = setInterval(() => {
      const items = document.querySelectorAll('.item');
      slider!.append(items[0]);
    }, 10000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
