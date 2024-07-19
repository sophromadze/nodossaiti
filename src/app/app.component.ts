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
          'cleaning, cleaning services, cleaning service, apartment, house, deep cleaning, move in cleaning, move out cleaning, apartment cleaning, house cleaning, professional cleaners, Dream Cleaning, home cleaning, Nika Sophromadze, Cleaners, cleaner, Best cleaning, Fast cleaning service, Brooklyn cleaning, Manhattan cleaning, Queens cleaning, Homemade, Airbnb, Lazy suzan cleaning, Sunlight cleaning, Neva cleaning, NYC cleaning, Cheapest cleaning service, Best cleaning company, Best cleaning service, Vacuum, Clean windows, Windows cleaning, Supplies, Brooklyn, Manhatten, Queens, Harlem, housekeeping, beforeandafter, homedecor, cleaning business, detailing, cleaningaccount, homesweethome, ecofriendly, cleaninghouse, carpet, coronavirus, hinch, love, mrshinchhome, washing, hygiene, powerwashing, hinched, springcleaning, cleaningcommunity, kitchen, business, cleaningday, homeaccount, realestate, instagood, maidservice, softwash, guttercleaning, fumigation, clean, cleaningmotivation, cleaningtips, cleaninghacks, deepcleaning, covid, commercialcleaning, cleaningproducts, cleanhome, officecleaning, residentialcleaning, windowcleaning, smallbusiness, pressurewashing, laundry, hincharmy, cleanhouse, bhfyp, mrshinch, hinching, housekeeping, office cleaning, eco-friendly cleaning, green cleaning, pet-friendly cleaning, sanitized cleaning, reliable cleaners, trusted cleaners, affordable cleaning, quality cleaning, residential cleaning, commercial cleaning, janitorial services, post-construction cleaning, event cleaning, customized cleaning services, spotless cleaning, premium cleaning, full-service cleaning.',
      },
      { name: 'author', content: 'Nika Sophromadze' },
      { name: 'robots', content: 'index, follow' },
    ]);
  }
}
