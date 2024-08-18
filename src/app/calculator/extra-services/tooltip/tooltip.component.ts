import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() controlName: string = '';

  extraDescriptions: { [key: string]: string } = {
    sameDay: 'Get cleaning today!',
    deepCleaning:
      'Our deep cleaning service ensures every nook and cranny is thoroughly cleaned and disinfected.',
    insideOfClosets:
      'We will organize and clean the inside of your closets, leaving them neat and tidy.',
    insideTheOven:
      'We will deep clean your oven including all inside surface areas.',
    insideTheFridge:
      'We will clean and disinfect the inside of your fridge, leaving it fresh and spotless.',
    insideWindows:
      'We will clean all inside windows ONLY and windows surface areas.',
    washingDishes: 'Our team will wash, dry, and put away your dishes for you.',
    wallCleaning:
      'We will scrub and clean your walls, removing dirt, smudges, and stains.',
    petHairClean: 'Got pets? Enjoy our pet hair cleaning at no extra charge.',
    insideCabinets:
      'We will clean and disinfect all shelves and surface areas including inside and out cabinets.',
    balcony:
      'We will sweep and mop the balcony area and clean outside balcony windows.',
    supplies:
      'If you would like DC CLEANERS to supply cleaning products, please select this box as we have customers that want us to use their supplies due to allergies, children, pets, etc. There is no charge for our cleaners to bring supplies.',
    office:
      'We will clean and organize your home office, ensuring a tidy workspace.',
    laundry: "Please add extra time if you'd like us to do laundry.",
    folding: 'We will fold your laundry neatly and organize it for you.',
    organizing:
      'Choose extra hours for our cleaners to help organize your space.',
    vacuum2: "We will bring a vacuum cleaner if you don't have one.",
  };

  get description(): string {
    return this.extraDescriptions[this.controlName] || '';
  }
}
