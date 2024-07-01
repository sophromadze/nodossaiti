import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() controlName: string = '';

  extraDescriptions: { [key: string]: string } = {
    sameDay: '',
    deepCleaning: '',
    insideOfClosets: '',
    insideTheOven:
      'We will deep clean your oven including all inside surface areas.',
    insideTheFridge: '',
    insideWindows:
      'We will clean all inside windows ONLY and winwo surface areas.',
    washingDishes: '',
    wallCleaning: '',
    petHairClean:
      ' by selected this extra it allies an extra minutes of cleaning time for the cleaner to attend to all the pet hair.',
    insideCabinets:
      'We will clean and disinfect all shelves and surface areas including inside and out cabinets .',
    balcony:
      'We will sweep and mop the balcony area and clean outside balcony windows',
    supplies:
      'If you would like DC CLEANERS to supply cleaning products, please select this box as we have costumes that want us to use their supplies due to allergies , children, petc etc. There is no charge for our cleaners to bring supplies.',
    office: '',
    laundy: "Please add extra time if you'd like us to do laundy",
    folding: '',
    organizing: '',
    vacuum: '',
  };

  get description(): string {
    return this.extraDescriptions[this.controlName] || '';
  }
}
