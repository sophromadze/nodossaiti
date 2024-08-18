import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Dream Cleaning - Professional Cleaning Services');
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Dream Cleaning offers professional cleaning services for apartments and houses. We ensure a spotless home with our trusted and efficient cleaning team.',
      },
      {
        name: 'keywords',
        content:
          'Dream Cleaning, pet-friendly cleaning NYC, pet-safe cleaning services, cleaning services NYC, house cleaning Manhattan, Brooklyn cleaning company, Queens eco-friendly cleaning, best NYC cleaners, affordable New York cleaning, professional cleaning services, home cleaning NYC, apartment cleaning Brooklyn, deep cleaning Queens, move in cleaning NYC, move out cleaning Brooklyn, office cleaning Manhattan, residential cleaning New York, commercial cleaning services NYC, sanitized cleaning Queens, reliable cleaners NYC, trusted cleaners New York, janitorial services Manhattan, post-construction cleaning NYC, customized cleaning services Brooklyn, spotless cleaning New York, premium cleaning services Manhattan, cleaning near Central Park, cleaning near Times Square, cleaning near Brooklyn Bridge, fast cleaning service, best cleaning company, best cleaning service, clean windows, window cleaning, housekeeping, spring cleaning, eco-friendly cleaning, green cleaning, affordable cleaning, quality cleaning, full-service cleaning, small business, pressure washing, soft wash, gutter cleaning, commercial cleaning, real estate cleaning, maid service, cleaning motivation, cleaning tips, cleaning hacks, residential cleaning, office cleaning, deep cleaning, move-in cleaning, move-out cleaning, vacuum, cleaning supplies, kitchen cleaning, laundry service, covid cleaning, coronavirus disinfection, sanitized cleaning, home decor cleaning, power washing, gutter cleaning, detailing cleaning, Airbnb cleaning, Manhattan cleaning, Brooklyn cleaning, Queens cleaning.',
      },

      { name: 'author', content: 'Nika Sophromadze' },
      { name: 'robots', content: 'index, follow' },
    ]);
  }
}
