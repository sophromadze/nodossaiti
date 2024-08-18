import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnInit,
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
  wallsNumbers: number;
  // selectedVacuumOption: string;
}

@Component({
  selector: 'app-extra-services',
  templateUrl: './extra-services.component.html',
  styleUrls: ['./extra-services.component.scss'],
})
export class ExtraServicesComponent implements OnInit, OnChanges {
  @Input() parentForm!: FormGroup;
  @Input() isCustomCleaning = false;
  @Output() extraServiceChanged = new EventEmitter<ExtraServiceData>();
  @Output() sameDayServiceChanged = new EventEmitter<boolean>();
  buttonText: string = 'Confirm';

  extraServices = [
    {
      controlName: 'sameDay',
      label: 'Same Day Service',
      iconPath: '/assets/images/sameDay3.webp',
    },
    {
      controlName: 'deepCleaning',
      label: 'Deep Cleaning',
      iconPath: '/assets/images/deepCleaning.webp',
    },
    {
      controlName: 'insideOfClosets',
      label: 'Inside of Closets',
      iconPath: '/assets/images/closets.webp',
    },
    {
      controlName: 'insideTheOven',
      label: 'Inside the Oven',
      iconPath: '/assets/images/oven.webp',
    },
    {
      controlName: 'insideTheFridge',
      label: 'Inside the Fridge',
      iconPath: '/assets/images/fridge.webp',
    },
    {
      controlName: 'insideWindows',
      label: 'Inside Windows',
      iconPath: '/assets/images/windows.webp',
    },
    {
      controlName: 'washingDishes',
      label: 'Washing Dishes',
      iconPath: '/assets/images/dishes.webp',
    },
    {
      controlName: 'wallCleaning',
      label: 'Walls',
      iconPath: '/assets/images/wall.webp',
    },
    {
      controlName: 'petHairClean',
      label: "Pet's in the Apartment",
      iconPath: '/assets/images/pets.webp',
    },
    {
      controlName: 'insideCabinets',
      label: 'Inside Kitchen Cabinets',
      iconPath: '/assets/images/kitchen.webp',
    },
    {
      controlName: 'balcony',
      label: 'Balcony Cleaning',
      iconPath: '/assets/images/balcony.webp',
    },
    {
      controlName: 'supplies',
      label: 'Use Cleaner Supplies',
      iconPath: '/assets/images/supplies.webp',
    },
    {
      controlName: 'office',
      label: 'Office',
      iconPath: '/assets/images/office.webp',
    },
    {
      controlName: 'laundry',
      label: 'Laundry',
      iconPath: '/assets/images/laundry.webp',
    },
    {
      controlName: 'folding',
      label: 'Folding / Organizing',
      iconPath: '/assets/images/folding.webp',
    },
    {
      controlName: 'organizing',
      label: 'Hours of Organizing',
      iconPath: '/assets/images/organizing.webp',
    },
    // {
    //   controlName: 'vacuum',
    //   label: 'Bring Vacuum Cleaner',
    //   iconPath: '/assets/images/vacuum.webp',
    // },
    {
      controlName: 'vacuum2',
      label: 'Bring Vacuum Cleaner',
      iconPath: '/assets/images/vacuum.webp',
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
    wallCleaning: 0.5,
    petHairClean: 0,
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

  // aq!!

  // selectedVacuumOption = '';
  // showVacuumOptions = false;
  organizingHours = 0.5;
  insideWindowsNumbers = 1;
  wallsNumbers = 1;
  showOrganizingInput = false;
  showWindowsInput = false;
  showWallsInput = false;
  tooltipVisible = false;
  currentTooltip: string | null = null;

  ngOnInit(): void {
    this.initializeFormControls();
    this.updateButtonText(window.innerWidth);
  }

  initializeFormControls(): void {
    this.parentForm.addControl(
      'insideWindows',
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
      ])
    );
    this.parentForm.addControl(
      'wallCleaning',
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
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

    this.parentForm.get('insideWindows')!.valueChanges.subscribe((value) => {
      this.insideWindowsNumbers = value;
      this.extraServicePrices['insideWindows'] = value * 30;
      this.emitChanges();
    });

    this.parentForm.get('wallCleaning')!.valueChanges.subscribe((value) => {
      this.wallsNumbers = value;
      this.extraServicePrices['wallCleaning'] = value * 25;
      this.emitChanges();
    });

    this.parentForm.get('organizing')!.valueChanges.subscribe((value) => {
      this.organizingHours = value;
      this.extraServicePrices['organizing'] = value * 27.5;
      this.emitChanges();
    });

    this.emitChanges();
  }

  validateOrganizingHours(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    return value % 0.5 !== 0 ? { invalidOrganizingHours: true } : null;
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

  ngAfterViewInit(): void {
    // Adding event listener to the clear button for the date picker
    const clearDateButton = document.getElementById('clearDateButton');
    if (clearDateButton) {
      clearDateButton.addEventListener('click', () => {
        this.clearDateAndUncheckSameDayService();
      });
    }

    this.emitChanges();
  }

  //saechvoa es unda shevcvalo tu ara jer ar vici
  toggleExtraService(service: string): void {
    const currentValue = this.parentForm.get(service)!.value;

    if (typeof currentValue === 'boolean') {
      this.parentForm.get(service)!.setValue(!currentValue);
    } else {
      // Handle specific cases where the value is not boolean
      if (service === 'organizing') {
        this.parentForm.get(service)?.setValue(!currentValue ? 0.5 : 0);
      } else if (service === 'insideWindows') {
        this.parentForm.get(service)?.setValue(!currentValue ? 1 : 0);
      } else if (service === 'wallCleaning') {
        this.parentForm.get(service)?.setValue(!currentValue ? 1 : 0);
      } else {
        this.parentForm.get(service)!.setValue(!currentValue ? 1 : 0);
      }
    }

    this.parentForm.updateValueAndValidity();

    if (service === 'sameDay') {
      this.sameDayServiceChanged.emit(!currentValue);
    }

    this.toggleInputVisibility(service, !currentValue);
    this.emitChanges();
  }

  toggleInputVisibility(service: string, isVisible: boolean): void {
    if (service === 'organizing') {
      this.showOrganizingInput = isVisible;
    } else if (service === 'insideWindows') {
      this.showWindowsInput = isVisible;
    } else if (service === 'wallCleaning') {
      this.showWallsInput = isVisible;
    }
  }

  onOrganizingHoursChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value) || value < 0.5) {
      value = 0.5;
    } else if (value > 5) {
      value = 5;
    } else {
      value = Math.round(value * 2) / 2; // Ensure steps of 0.5
    }

    input.value = value.toString();
    this.organizingHours = value;
    this.extraServicePrices['organizing'] = value * 27.5;
    this.extraServiceTimes['organizing'] = value * 0.5;
    this.parentForm.get('organizing')!.setValue(value);
    this.emitChanges();
  }

  confirmOrganizingHours(event: Event): void {
    event.stopPropagation();
    this.showOrganizingInput = false;
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
    this.extraServiceTimes['insideWindows'] = value * 0.5;
    this.parentForm.get('insideWindows')!.setValue(value);
    this.emitChanges();
  }

  confirmInsideWindowsNumbers(event: Event): void {
    event.stopPropagation();
    this.showWindowsInput = false;
    this.emitChanges();
  }

  onWallsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 20) {
      value = 20;
    }

    input.value = value.toString();
    this.wallsNumbers = value;
    this.extraServicePrices['wallCleaning'] = value * 25;
    this.extraServiceTimes['wallCleaning'] = value * 0.5;
    this.parentForm.get('wallCleaning')!.setValue(value);
    this.emitChanges();
  }

  confirmWallsNumbers(event: Event): void {
    event.stopPropagation();
    this.showWallsInput = false;
    this.emitChanges();
  }

  emitChanges(): void {
    this.extraServiceChanged.emit({
      prices: this.extraServicePrices,
      times: this.extraServiceTimes,
      organizingHours: this.organizingHours,
      insideWindowsNumbers: this.insideWindowsNumbers,
      wallsNumbers: this.wallsNumbers,
    });
  }

  increaseInsideWindows(event: Event): void {
    event.stopPropagation();
    if (this.insideWindowsNumbers < 20) {
      this.insideWindowsNumbers++;
      this.parentForm.get('insideWindows')?.setValue(this.insideWindowsNumbers);
      this.emitChanges();
    }
  }

  decreaseInsideWindows(event: Event): void {
    event.stopPropagation();
    if (this.insideWindowsNumbers > 1) {
      this.insideWindowsNumbers--;
      this.parentForm.get('insideWindows')?.setValue(this.insideWindowsNumbers);
      this.emitChanges();
    }
  }

  increaseWalls(event: Event): void {
    event.stopPropagation();
    if (this.wallsNumbers < 20) {
      this.wallsNumbers++;
      this.parentForm.get('wallCleaning')?.setValue(this.wallsNumbers);
      this.emitChanges();
    }
  }

  decreaseWalls(event: Event): void {
    event.stopPropagation();
    if (this.wallsNumbers > 1) {
      this.wallsNumbers--;
      this.parentForm.get('wallCleaning')?.setValue(this.wallsNumbers);
      this.emitChanges();
    }
  }

  increaseOrganizingHours(event: Event): void {
    event.stopPropagation();
    if (this.organizingHours < 5) {
      this.organizingHours += 0.5;
      this.parentForm.get('organizing')?.setValue(this.organizingHours);
      this.emitChanges();
    }
  }

  decreaseOrganizingHours(event: Event): void {
    event.stopPropagation();
    if (this.organizingHours > 0.5) {
      this.organizingHours -= 0.5;
      this.parentForm.get('organizing')?.setValue(this.organizingHours);
      this.emitChanges();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateButtonText(event.target.innerWidth);
  }
  getWindowsText(): string {
    return this.insideWindowsNumbers === 1 ? 'Window' : 'Windows';
  }
  getWallsText(): string {
    return this.wallsNumbers === 1 ? 'Wall' : 'Walls';
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
  showTooltip(controlName: string): void {
    this.currentTooltip = controlName;
    this.tooltipVisible = true;
  }
  hideTooltip(): void {
    this.tooltipVisible = false;
    this.currentTooltip = null;
  }
}
