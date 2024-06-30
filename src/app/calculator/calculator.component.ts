import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  calculatorForm: FormGroup;

  extraServices = [
    { controlName: 'sameDay', label: 'Same Day Service' },
    { controlName: 'deepCleaning', label: 'Deep Cleaning' },
    { controlName: 'insideOfClosets', label: 'Inside of Closets' },
    { controlName: 'insideTheOven', label: 'Inside the Oven' },
    { controlName: 'insideTheFridge', label: 'Inside the Fridge' },
    { controlName: 'insideWindows', label: 'Inside Windows' },
    { controlName: 'washingDishes', label: 'Washing Dishes' },
    { controlName: 'wallCleaning', label: 'Walls' },
    { controlName: 'petHairClean', label: 'Pet Hair Clean-up' },
    { controlName: 'insideCabinets', label: 'Inside Kitchen Cabinets' },
    { controlName: 'balcony', label: 'Balcony Cleaning' },
    { controlName: 'supplies', label: 'Use Cleaner Supplies' },
    { controlName: 'baseboards', label: 'Baseboards' },
    { controlName: 'office', label: 'Office' },
  ];

  extraServicePrices: { [key: string]: number } = {
    sameDay: 40,
    deepCleaning: 110,
    insideOfClosets: 15,
    insideTheOven: 25,
    insideTheFridge: 20,
    insideWindows: 20,
    washingDishes: 10,
    wallCleaning: 25,
    petHairClean: 35,
    insideCabinets: 25,
    balcony: 15,
    supplies: 10,
    baseboards: 20,
    office: 50,
  };

  extraServiceTimes: { [key: string]: number } = {
    sameDay: 0, // Example time in hours
    deepCleaning: 1.0,
    insideOfClosets: 0.5,
    insideTheOven: 0.5,
    insideTheFridge: 0.5,
    insideWindows: 0.5,
    washingDishes: 0.5,
    wallCleaning: 1.0,
    petHairClean: 1.0,
    insideCabinets: 0.5,
    balcony: 0.5,
    supplies: 0.0,
    baseboards: 0.5,
    office: 1.0,
  };

  bathroomOptions = [1, 2, 3, 4, 5, 6];

  frequencies = [
    { value: 'One Time', label: 'One Time', discount: 0 },
    { value: 'Weekly', label: 'Weekly 10% Discount', discount: 10 },
    { value: 'Every 2 Weeks', label: 'Every 2 Weeks 8% Discount', discount: 8 },
    { value: 'Every 3 Weeks', label: '3 Weekly 5.5%', discount: 5.5 },
    { value: 'Monthly', label: 'Monthly Discount 3%', discount: 3 },
  ];

  cleanersOptions = [1, 2, 3, 4, 5];
  hoursOptions = [
    3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
    12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19,
    19.5, 20,
  ];

  totalPrice: number | null = null;
  subTotalTime: number | null = null;
  totalTime: number | null = null;
  salesTax: number | null = null;
  total: number | null = null;
  isCustomCleaning = false;
  requiredCleaners: number | null = null;

  constructor(private fb: FormBuilder) {
    this.calculatorForm = this.fb.group({
      serviceType: ['', Validators.required],
      bedrooms: ['studio'],
      bathrooms: [1],
      serviceDate: ['', Validators.required],
      serviceTime: ['', Validators.required], // Remove default value
      frequency: ['One Time', Validators.required],
      entryMethod: ['', Validators.required],
      discountCode: [''],
      specialInstructions: [''],
      sameDay: [false],
      deepCleaning: [false],
      insideOfClosets: [false],
      insideTheOven: [false],
      insideTheFridge: [false],
      washingDishes: [false],
      wallCleaning: [false],
      insideWindows: [false],
      petHairClean: [false],
      insideCabinets: [false],
      balcony: [false],
      supplies: [false],
      baseboards: [false],
      office: [false],
      cleaners: [1],
      hours: [3],
    });

    this.calculatorForm.get('serviceDate')!.valueChanges.subscribe((value) => {
      if (value) {
        this.calculatorForm
          .get('serviceTime')!
          .setValue('07:00', { emitEvent: false });
      }
    });

    this.calculatorForm.get('serviceType')!.valueChanges.subscribe(() => {
      this.onServiceTypeChange();
    });

    this.calculatorForm.valueChanges.subscribe(() => {
      this.calculatePriceAndTime();
    });
  }

  ngOnInit(): void {
    this.calculatePriceAndTime();
  }

  onServiceTypeChange(): void {
    const serviceType = this.calculatorForm.get('serviceType')!.value;
    this.isCustomCleaning = serviceType === 'Custom Cleaning';

    if (this.isCustomCleaning) {
      this.calculatorForm.get('bedrooms')!.disable();
      this.calculatorForm.get('bathrooms')!.disable();
      this.calculatorForm.get('cleaners')!.enable();
      this.calculatorForm.get('hours')!.enable();
    } else {
      this.calculatorForm.get('bedrooms')!.enable();
      this.calculatorForm.get('bathrooms')!.enable();
      this.calculatorForm.get('cleaners')!.disable();
      this.calculatorForm.get('hours')!.disable();
    }
    this.calculatePriceAndTime();
  }

  // applyDiscount(): void {
  //   // Implement discount code logic here
  // }

  setFrequency(frequency: string): void {
    this.calculatorForm.get('frequency')!.setValue(frequency);
    this.calculatePriceAndTime();
  }

  toggleExtraService(service: string): void {
    const currentValue = this.calculatorForm.get(service)!.value;
    this.calculatorForm.get(service)!.setValue(!currentValue);
    this.calculatePriceAndTime();
  }

  calculatePriceAndTime(): void {
    const formValues = this.calculatorForm.value;
    // Set base prices and times
    let basePrice = 0;
    let subTotalTime = 0;

    // Example calculations (adjust these according to your actual logic)
    switch (formValues.serviceType) {
      case 'Residential':
        basePrice += 0;
        subTotalTime += 0;
        break;
      case 'Move In':
        basePrice += 0;
        subTotalTime += 0;
        break;
      case 'Move Out':
        basePrice += 0;
        subTotalTime += 0;
        break;
      case 'Custom Cleaning':
        basePrice += 0;
        subTotalTime += 0;
        break;
    }

    let bedroomBasePrice = 0;
    let bedroomTime = 0;

    switch (formValues.bedrooms) {
      case 'studio':
        bedroomBasePrice = 140;
        bedroomTime = formValues.deepCleaning ? 3.5 : 1.5;
        break;
      case 'one':
        bedroomBasePrice = 150;
        bedroomTime = formValues.deepCleaning ? 5 : 2;
        break;
      case 'two':
        bedroomBasePrice = 180;
        bedroomTime = formValues.deepCleaning ? 6 : 2.5;
        break;
      case 'three':
        bedroomBasePrice = 220;
        bedroomTime = formValues.deepCleaning ? 7 : 3.5;
        break;
      case 'four':
        bedroomBasePrice = 260;
        bedroomTime = formValues.deepCleaning ? 8 : 4.5;
        break;
      case 'five':
        bedroomBasePrice = 300;
        bedroomTime = formValues.deepCleaning ? 9 : 5.5;
        break;
      case 'six':
        bedroomBasePrice = 340;
        bedroomTime = formValues.deepCleaning ? 10 : 6.5;
        break;
    }
    basePrice += bedroomBasePrice;
    subTotalTime += bedroomTime;

    // Bathrooms calculation
    const bathrooms = formValues.bathrooms;
    if (bathrooms > 1) {
      const extraBathrooms = bathrooms - 1;
      basePrice += extraBathrooms * 50;
      subTotalTime += extraBathrooms * 0.5;
    }

    // Additional pricing rules for deep cleaning
    if (formValues.deepCleaning) {
      let deepCleaningBase = 110 + bedroomBasePrice; // Add $110 to base price
      switch (formValues.bedrooms) {
        case 'two':
          basePrice += deepCleaningBase * 0.2; // 20% additional
          break;
        case 'three':
          basePrice += deepCleaningBase * 0.3; // 30% additional
          break;
        case 'four':
          basePrice += deepCleaningBase * 0.4; // 40% additional
          break;
        case 'five':
          basePrice += deepCleaningBase * 0.5; // 50% additional
          break;
        case 'six':
          basePrice += deepCleaningBase * 0.6; // 60% additional
          break;
      }
      basePrice += 110; // Add $110 after percentage calculation
    }

    // Custom Cleaning calculation
    if (formValues.serviceType === 'Custom Cleaning') {
      basePrice = formValues.cleaners * formValues.hours * 55;
      subTotalTime = formValues.hours;

      // Adding Same Day Service and Deep Cleaning for Custom Cleaning
      if (formValues.sameDay) {
        basePrice += this.extraServicePrices['sameDay'];
      }
      if (formValues.deepCleaning) {
        basePrice += this.extraServicePrices['deepCleaning'];
        basePrice += formValues.cleaners * formValues.hours * 55 * 0.5; // Adding 50% of base price per hour for deep cleaning
      }
    } else {
      this.extraServices.forEach((service) => {
        if (
          formValues[service.controlName] &&
          service.controlName !== 'deepCleaning'
        ) {
          basePrice += this.extraServicePrices[service.controlName]; // Use the price from the extraServicePrices object
          subTotalTime += this.extraServiceTimes[service.controlName]; // Use the time from the extraServiceTimes object
        }
      });
    }

    // Apply discount based on frequency
    const frequencyDiscount =
      this.frequencies.find((freq) => freq.value === formValues.frequency)
        ?.discount || 0;
    const discountAmount = (basePrice * frequencyDiscount) / 100;
    basePrice -= discountAmount;

    const salesTax = basePrice * 0.088; // Calculate sales tax
    const total = basePrice + salesTax; // Calculate total

    this.totalPrice = basePrice; // Include additionalPrice for display
    this.subTotalTime = subTotalTime;

    // Determine the required number of cleaners for non-custom cleaning
    if (formValues.serviceType !== 'Custom Cleaning') {
      this.requiredCleaners = Math.ceil(subTotalTime / 5);
      this.totalTime = subTotalTime / this.requiredCleaners;
    } else {
      this.requiredCleaners = formValues.cleaners;
      this.totalTime = subTotalTime;
    }

    this.salesTax = salesTax; // Store sales tax
    this.total = total; // Store total
  }

  formatTimeToHoursAndMinutes(time: number): string {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours} hours and ${minutes} minutes`;
  }

  formatTimeToAmPm(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  onSubmit(): void {
    if (this.calculatorForm.valid) {
      // Handle form submission
      console.log(this.calculatorForm.value);
    } else {
      // Mark all controls as touched to trigger validation messages
      this.calculatorForm.markAllAsTouched();
    }
  }
}
