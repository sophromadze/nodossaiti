import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
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
  organizingHours: number;
  insideWindowsNumbers: number;
  // selectedVacuumOption: string;
}

@Component({
  selector: 'app-extra-services',
  templateUrl: './extra-services.component.html',
  styleUrls: ['./extra-services.component.scss'],
})
export class ExtraServicesComponent implements OnChanges {
  @Input() parentForm!: FormGroup;
  @Input() isCustomCleaning = false;
  @Output() extraServiceChanged = new EventEmitter<ExtraServiceData>();
  @Output() sameDayServiceChanged = new EventEmitter<boolean>();
  buttonText: string = 'Confirm';

  extraServices = [
    {
      controlName: 'sameDay',
      label: 'Same Day Service',
      iconPath: '/assets/images/sameDay3.png',
    },
    {
      controlName: 'deepCleaning',
      label: 'Deep Cleaning',
      iconPath: '/assets/images/deepCleaning.png',
    },
    {
      controlName: 'insideOfClosets',
      label: 'Inside of Closets',
      iconPath: '/assets/images/closets.png',
    },
    {
      controlName: 'insideTheOven',
      label: 'Inside the Oven',
      iconPath: '/assets/images/oven.png',
    },
    {
      controlName: 'insideTheFridge',
      label: 'Inside the Fridge',
      iconPath: '/assets/images/fridge.png',
    },
    {
      controlName: 'insideWindows',
      label: 'Inside Windows',
      iconPath: '/assets/images/windows.png',
    },
    {
      controlName: 'washingDishes',
      label: 'Washing Dishes',
      iconPath: '/assets/images/dishes.png',
    },
    {
      controlName: 'wallCleaning',
      label: 'Walls',
      iconPath: '/assets/images/wall.png',
    },
    {
      controlName: 'petHairClean',
      label: "Pet's in the Apartment",
      iconPath: '/assets/images/pets.png',
    },
    {
      controlName: 'insideCabinets',
      label: 'Inside Kitchen Cabinets',
      iconPath: '/assets/images/kitchen.png',
    },
    {
      controlName: 'balcony',
      label: 'Balcony Cleaning',
      iconPath: '/assets/images/balcony.png',
    },
    {
      controlName: 'supplies',
      label: 'Use Cleaner Supplies',
      iconPath: '/assets/images/supplies.png',
    },
    {
      controlName: 'office',
      label: 'Office',
      iconPath: '/assets/images/office.png',
    },
    {
      controlName: 'laundry',
      label: 'Laundry',
      iconPath: '/assets/images/laundry.png',
    },
    {
      controlName: 'folding',
      label: 'Folding / Organizing',
      iconPath: '/assets/images/folding.png',
    },
    {
      controlName: 'organizing',
      label: 'Hours of Organizing',
      iconPath: '/assets/images/organizing.png',
    },
    // {
    //   controlName: 'vacuum',
    //   label: 'Bring Vacuum Cleaner',
    //   iconPath: '/assets/images/vacuum.png',
    // },
    {
      controlName: 'vacuum2',
      label: 'Bring Vacuum Cleaner',
      iconPath: '/assets/images/vacuum.png',
    },
  ];

  extraServicePrices: { [key: string]: number } = {
    sameDay: 30,
    deepCleaning: 50,
    insideOfClosets: 25,
    insideTheOven: 45,
    insideTheFridge: 40,
    insideWindows: 30,
    washingDishes: 30,
    wallCleaning: 25,
    petHairClean: 0,
    insideCabinets: 30,
    balcony: 55,
    supplies: 0,
    office: 50,
    laundry: 40,
    folding: 25,
    organizing: 27.5,
    // vacuum: 90,
    vacuum2: 90,
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
    petHairClean: 0.5,
    insideCabinets: 0.5,
    balcony: 1.0,
    supplies: 0.0,
    office: 1.0,
    laundry: 1.0,
    folding: 1.0,
    organizing: 0.5,
    // vacuum: 1.0,
    vacuum2: 1.0,
  };

  // selectedVacuumOption = '';
  // showVacuumOptions = false;
  organizingHours = 0.5;
  insideWindowsNumbers = 1;
  showOrganizingInput = false;
  showWindowsInput = false;
  tooltipVisible = false;
  currentTooltip: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.parentForm.addControl(
      'insideWindows',
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
        Validators.pattern(/^\d+$/),
      ])
    );
    this.parentForm.addControl(
      'organizing',
      new FormControl(0.5, [
        Validators.required,
        Validators.min(0.5),
        Validators.max(5),
        this.validateOrganizingHours,
      ])
    );

    this.updateButtonText(window.innerWidth);

    // if (this.parentForm.get('vacuum')!.value) {
    //   this.showVacuumOptions = true;
    //   this.extraServicePrices['vacuum'] = 90;
    // }
  }

  ngAfterViewInit(): void {
    // Adding event listener to the clear button for the date picker
    const clearDateButton = document.getElementById('clearDateButton');
    if (clearDateButton) {
      clearDateButton.addEventListener('click', () => {
        this.clearDateAndUncheckSameDayService();
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateButtonText(event.target.innerWidth);
  }

  updateButtonText(width: number): void {
    this.buttonText = width <= 1150 ? 'OK' : 'Confirm';
  }

  clearDateAndUncheckSameDayService(): void {
    this.parentForm.get('serviceDate')?.setValue(null);
    if (this.parentForm.get('sameDay')?.value) {
      this.parentForm.get('sameDay')?.setValue(false);
      this.emitChanges();
      this.sameDayServiceChanged.emit(false);
    }
  }

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
      this.emitChanges();
    }
  }

  toggleExtraService(service: string): void {
    const currentValue = this.parentForm.get(service)!.value;
    this.parentForm.get(service)!.setValue(!currentValue);
    this.parentForm.updateValueAndValidity();

    // if (service === 'vacuum')
    //    {
    //   if (!currentValue) {
    //     this.showVacuumOptions = true;
    //     this.selectedVacuumOption = 'Standard';
    //     this.extraServicePrices['vacuum'] = 90;
    //   } else {
    //     this.showVacuumOptions = false;
    //     this.selectedVacuumOption = '';
    //     this.extraServicePrices['vacuum'] = 90;
    //   }
    // }
    //  else
    if (service === 'organizing') {
      if (!currentValue) {
        this.showOrganizingInput = true;
        this.extraServicePrices['organizing'] = 27.5;
        this.extraServiceTimes['organizing'] = 0.5;
      } else {
        this.showOrganizingInput = false;
        this.extraServicePrices['organizing'] = 0;
        this.extraServiceTimes['organizing'] = 0;
        this.organizingHours = 0.5;
      }
    } else if (service === 'insideWindows') {
      if (!currentValue) {
        this.showWindowsInput = true;
        this.extraServicePrices['insideWindows'] = 30;
        this.extraServiceTimes['insideWindows'] = 0.5;
      } else {
        this.showWindowsInput = false;
        this.extraServicePrices['insideWindows'] = 0;
        this.extraServiceTimes['insideWindows'] = 0;
        this.insideWindowsNumbers = 1;
      }
    }

    if (service === 'sameDay') {
      this.sameDayServiceChanged.emit(!currentValue);
    }

    this.emitChanges();
  }

  // selectVacuumOption(option: string, event: Event): void {
  //   event.stopPropagation();
  //   this.selectedVacuumOption = option;
  //   this.extraServicePrices['vacuum'] = option === 'Standard' ? 90 : 150;
  //   this.parentForm.get('vacuum')!.setValue(true);
  //   this.emitChanges();
  // }

  onOrganizingHoursChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value) || value < 0.5) {
      value = 0.5;
    } else if (value > 5) {
      value = 5;
    } else {
      value = Math.round(value * 2) / 2;
    }

    input.value = value.toString();
    this.organizingHours = value;
    this.extraServicePrices['organizing'] = value * 55;
    this.extraServiceTimes['organizing'] = value;
    this.parentForm.get('organizing')!.setValue(value, { emitEvent: false });
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
    this.extraServiceTimes['insideWindows'] = value;
    this.parentForm.get('insideWindows')!.setValue(value, { emitEvent: false });
    this.emitChanges();
  }

  confirminsideWindowsNumbers(event: Event): void {
    event.stopPropagation();
    if (!this.insideWindowsNumbers || this.insideWindowsNumbers < 1) {
      this.insideWindowsNumbers = 1;
    }
    this.showWindowsInput = false;
    this.parentForm.get('insideWindows')!.setValue(this.insideWindowsNumbers);
    this.emitChanges();
  }

  decreaseInsideWindows(event: Event): void {
    event.stopPropagation();
    if (this.insideWindowsNumbers > 1) {
      this.insideWindowsNumbers--;
      this.onInsideWindowsChange({
        target: { value: this.insideWindowsNumbers },
      } as any);
    }
  }

  increaseInsideWindows(event: Event): void {
    event.stopPropagation();
    if (this.insideWindowsNumbers < 20) {
      this.insideWindowsNumbers++;
      this.onInsideWindowsChange({
        target: { value: this.insideWindowsNumbers },
      } as any);
    }
  }

  decreaseOrganizingHours(event: Event): void {
    event.stopPropagation();
    if (this.organizingHours > 0.5) {
      this.organizingHours -= 0.5;
      this.onOrganizingHoursChange({
        target: { value: this.organizingHours },
      } as any);
    }
  }

  increaseOrganizingHours(event: Event): void {
    event.stopPropagation();
    if (this.organizingHours < 5) {
      this.organizingHours += 0.5;
      this.onOrganizingHoursChange({
        target: { value: this.organizingHours },
      } as any);
    }
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
      organizingHours: this.organizingHours,
      insideWindowsNumbers: this.insideWindowsNumbers,
      // selectedVacuumOption: this.selectedVacuumOption,
    });
  }

  getWindowsText(): string {
    return this.insideWindowsNumbers === 1 ? 'Window' : 'Windows';
  }
}
