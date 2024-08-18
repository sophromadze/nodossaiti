import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit, OnDestroy {
  private intervalId: any; // Interval ID for the auto-slide functionality
  private activateSliderHandler: any; // Reference to the slider activation handler

  constructor(private router: Router, private renderer: Renderer2) {
    this.activateSliderHandler = this.activateSlider.bind(this); // Bind the slider handler
  }

  ngOnInit() {
    this.startAutoSlide(); // Start the auto-slide when the component is initialized
    document.addEventListener('click', this.activateSliderHandler, false); // Add event listener for navigation buttons
  }

  ngOnDestroy() {
    this.stopAutoSlide(); // Stop the auto-slide when the component is destroyed
    document.removeEventListener('click', this.activateSliderHandler, false); // Remove event listener to prevent memory leaks
  }

  activateSlider(e: any) {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.item');
    if (e.target.matches('.next')) {
      // If the "next" button is clicked
      slider!.append(items[0]); // Move the first item to the end
    } else if (e.target.matches('.prev')) {
      // If the "prev" button is clicked
      slider!.prepend(items[items.length - 1]); // Move the last item to the beginning
    }
  }

  navigateToCalculator() {
    this.router.navigate(['/calculator']); // Navigate to the calculator page
  }

  startAutoSlide() {
    const slider = document.querySelector('.slider');
    this.intervalId = setInterval(() => {
      const items = document.querySelectorAll('.item');
      slider!.append(items[0]); // Auto-slide: move the first item to the end every 10 seconds
    }, 100000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval to stop the auto-slide
    }
  }
}
