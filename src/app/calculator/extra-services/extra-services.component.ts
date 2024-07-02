import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface ExtraServiceData {
  prices: { [key: string]: number };
  times: { [key: string]: number };
  organizingHours: number; // Add organizingHours property
  insideWindowsNumbers: number; // Add windowsNumbers property
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
    insideOfClosets: 25,
    insideTheOven: 45,
    insideTheFridge: 40,
    insideWindows: 30,
    washingDishes: 30,
    wallCleaning: 25, //დასაზუსტებელია
    petHairClean: 0,
    insideCabinets: 30,
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
    insideOfClosets: 0.5,
    insideTheOven: 1.0,
    insideTheFridge: 1.0,
    insideWindows: 0.5,
    washingDishes: 1.0,
    wallCleaning: 1.0,
    petHairClean: 1.0, // ???
    insideCabinets: 0.5,
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
  insideWindowsNumbers = 1; // Default to 1
  showOrganizingInput = false; // Track whether to show organizing input
  showWindowsInput = false; // Track whether to show windows input

  // Tooltip properties
  tooltipVisible = false;
  currentTooltip: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Initialize form controls with validators
    this.parentForm.addControl(
      'insideWindows',
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
        Validators.pattern(/^\d+$/), // Only integers
      ])
    );
    this.parentForm.addControl(
      'organizing',
      new FormControl(0.5, [
        Validators.required,
        Validators.min(0.5),
        Validators.max(5),
        this.validateOrganizingHours, // Custom validator for 0.5 increments
      ])
    );

    // Ensure the vacuum option is defaulted to Standard
    if (this.parentForm.get('vacuum')!.value) {
      this.showVacuumOptions = true;
      this.extraServicePrices['vacuum'] = 90;
    }
  }

  // Custom validator for organizing hours (must be multiple of 0.5)
  validateOrganizingHours(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (value % 0.5 !== 0) {
      return { invalidOrganizingHours: true };
    }
    return null;
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
    } else if (service === 'insideWindows') {
      if (!currentValue) {
        this.showWindowsInput = true;
        this.extraServicePrices['insideWindows'] = 30; // Default to1 window
        this.extraServiceTimes['insideWindows'] = 0.5; // Set default time
      } else {
        this.showWindowsInput = false;
        this.extraServicePrices['insideWindows'] = 0;
        this.extraServiceTimes['insideWindows'] = 0;
        this.insideWindowsNumbers = 1;
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

  onOrganizingHoursChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value) || value < 0.5) {
      value = 0.5;
    } else if (value > 5) {
      value = 5;
    } else {
      value = Math.round(value * 2) / 2; // Round to nearest 0.5
    }

    input.value = value.toString();
    this.organizingHours = value;
    this.extraServicePrices['organizing'] = value * 55;
    this.extraServiceTimes['organizing'] = value; // Update time
    this.parentForm.get('organizing')!.setValue(value, { emitEvent: false }); // Ensure organizing button stays checked
    this.emitChanges();
  }

  confirmOrganizingHours(event: Event): void {
    event.stopPropagation();
    if (!this.organizingHours || this.organizingHours < 0.5) {
      this.organizingHours = 0.5;
    }
    this.showOrganizingInput = false;
    this.parentForm.get('organizing')!.setValue(this.organizingHours);
    this.emitChanges();
  }

  onInsideWindowsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 20) {
      value = 20;
    }

    input.value = value.toString();
    this.insideWindowsNumbers = value;
    this.extraServicePrices['insideWindows'] = value * 30;
    this.extraServiceTimes['insideWindows'] = value; // Update time
    this.parentForm.get('insideWindows')!.setValue(value, { emitEvent: false }); // Ensure windows button stays checked
    this.emitChanges();
  }

  confirminsideWindowsHours(event: Event): void {
    event.stopPropagation();
    if (!this.insideWindowsNumbers || this.insideWindowsNumbers < 1) {
      this.insideWindowsNumbers = 1;
    }
    this.showWindowsInput = false;
    this.parentForm.get('insideWindows')!.setValue(this.insideWindowsNumbers);
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
      insideWindowsNumbers: this.insideWindowsNumbers, // Emit organizingHours
      selectedVacuumOption: this.selectedVacuumOption, // Emit selectedVacuumOption
    });
  }
}
