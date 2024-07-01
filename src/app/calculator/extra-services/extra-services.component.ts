import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

interface ExtraServiceData {
  prices: { [key: string]: number };
  times: { [key: string]: number };
  organizingHours: number; // Add organizingHours property
  selectedVacuumOption: string; // Add selectedVacuumOption property
}

@Component({
  selector: 'app-extra-services',
  templateUrl: './extra-services.component.html',
  styleUrls: ['./extra-services.component.scss'],
})
export class ExtraServicesComponent implements OnInit, OnChanges {
  @Input() parentForm!: FormGroup;
  @Input() isCustomCleaning = false;
  @Output() extraServiceChanged = new EventEmitter<ExtraServiceData>(); // Update the type here
  @Output() sameDayServiceChanged = new EventEmitter<boolean>();

  extraServices = [
    { controlName: 'sameDay', label: 'Same Day Service' },
    { controlName: 'deepCleaning', label: 'Deep Cleaning' },
    { controlName: 'insideOfClosets', label: 'Inside of Closets' },
    { controlName: 'insideTheOven', label: 'Inside the Oven' },
    { controlName: 'insideTheFridge', label: 'Inside the Fridge' },
    { controlName: 'insideWindows', label: 'Inside Windows' },
    { controlName: 'washingDishes', label: 'Washing Dishes' },
    { controlName: 'wallCleaning', label: 'Walls' },
    { controlName: 'petHairClean', label: "Pet's in the Apartment" },
    { controlName: 'insideCabinets', label: 'Inside Kitchen Cabinets' },
    { controlName: 'balcony', label: 'Balcony Cleaning' },
    { controlName: 'supplies', label: 'Use Cleaner Supplies' },
    { controlName: 'office', label: 'Office' },
    { controlName: 'laundy', label: 'Laundy' },
    { controlName: 'folding', label: 'Folding/Organizing' },
    { controlName: 'organizing', label: 'Hours of Organizing' },
    { controlName: 'vacuum', label: 'Bring Vacuum Cleaner' },
  ];

  extraServicePrices: { [key: string]: number } = {
    sameDay: 30,
    deepCleaning: 110,
    insideOfClosets: 0, // დროებით
    insideTheOven: 45,
    insideTheFridge: 40,
    insideWindows: 45, // რაოდენობა მაქვს ჩასამატებელი თითოეულზე.
    washingDishes: 30,
    wallCleaning: 25, //დასაზუსტებელია
    petHairClean: 35,
    insideCabinets: 55,
    balcony: 55,
    supplies: 0,
    office: 50, // დასაზუსტებელია
    laundy: 40,
    folding: 25,
    organizing: 27.5,
    vacuum: 90,
  };

  extraServiceTimes: { [key: string]: number } = {
    sameDay: 0,
    deepCleaning: 1.0,
    insideOfClosets: 1.0, // დროებით?
    insideTheOven: 1.0,
    insideTheFridge: 1.0,
    insideWindows: 1.0,
    washingDishes: 1.0,
    wallCleaning: 1.0,
    petHairClean: 1.0,
    insideCabinets: 1.0,
    balcony: 1.0,
    supplies: 0.0,
    office: 1.0,
    laundy: 1.0,
    folding: 1.0,
    organizing: 0.5,
    vacuum: 1.0,
  };

  selectedVacuumOption = ''; // Default to empty
  showVacuumOptions = false;
  organizingHours = 0.5; // Default to 0.5 hours
  showOrganizingInput = false; // Track whether to show organizing input

  // Tooltip properties
  tooltipVisible = false;
  currentTooltip: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Ensure the vacuum option is defaulted to Standard
    if (this.parentForm.get('vacuum')!.value) {
      this.showVacuumOptions = true;
      this.extraServicePrices['vacuum'] = 90;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isCustomCleaning']) {
      if (this.isCustomCleaning) {
        this.parentForm.get('organizing')!.disable();
      } else {
        this.parentForm.get('organizing')!.enable();
      }
      this.emitChanges(); // Emit changes to notify parent form
    }
  }

  toggleExtraService(service: string): void {
    const currentValue = this.parentForm.get(service)!.value;
    this.parentForm.get(service)!.setValue(!currentValue);
    this.parentForm.updateValueAndValidity();

    if (service === 'vacuum') {
      if (!currentValue) {
        this.showVacuumOptions = true;
        this.selectedVacuumOption = 'Standard';
        this.extraServicePrices['vacuum'] = 90;
      } else {
        this.showVacuumOptions = false;
        this.selectedVacuumOption = '';
        this.extraServicePrices['vacuum'] = 90;
      }
    } else if (service === 'organizing') {
      if (!currentValue) {
        this.showOrganizingInput = true;
        this.extraServicePrices['organizing'] = 27.5; // Default to 0.5 hours
        this.extraServiceTimes['organizing'] = 0.5; // Set default time
      } else {
        this.showOrganizingInput = false;
        this.extraServicePrices['organizing'] = 0;
        this.extraServiceTimes['organizing'] = 0;
        this.organizingHours = 0.5;
      }
    }

    if (service === 'sameDay') {
      this.sameDayServiceChanged.emit(!currentValue); // Emit event when same day service is toggled
    }

    this.emitChanges();
  }

  selectVacuumOption(option: string, event: Event): void {
    event.stopPropagation();
    this.selectedVacuumOption = option;
    this.extraServicePrices['vacuum'] = option === 'Standard' ? 90 : 150;
    this.parentForm.get('vacuum')!.setValue(true);
    this.emitChanges();
  }

  onOrganizingHoursChange(hours: number): void {
    this.organizingHours = hours;
    this.extraServicePrices['organizing'] = hours * 55;
    this.extraServiceTimes['organizing'] = hours; // Update time
    this.parentForm.get('organizing')!.setValue(true); // Ensure organizing button stays checked
    this.emitChanges();
  }

  confirmOrganizingHours(event: Event): void {
    event.stopPropagation();
    this.showOrganizingInput = false;
    this.parentForm.get('organizing')!.setValue(true);
    this.emitChanges();
  }

  showTooltip(controlName: string): void {
    this.currentTooltip = controlName;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.currentTooltip = null;
  }

  emitChanges(): void {
    this.extraServiceChanged.emit({
      prices: this.extraServicePrices,
      times: this.extraServiceTimes,
      organizingHours: this.organizingHours, // Emit organizingHours
      selectedVacuumOption: this.selectedVacuumOption, // Emit selectedVacuumOption
    });
  }
}
