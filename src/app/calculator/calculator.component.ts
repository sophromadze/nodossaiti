import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  calculatorForm: FormGroup;
  minDate!: string;
  isSameDayService: boolean = false;
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
  extraServicePrices: { [key: string]: number } = {};
  extraServiceTimes: { [key: string]: number } = {};
  originalServiceDate: string | null = null;
  organizingHours: number | null = 0; // Initialize organizing hours
  selectedVacuumOption: string = 'None'; // Initialize vacuum option

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.calculatorForm = this.fb.group({
      serviceType: ['', Validators.required],
      bedrooms: ['studio'],
      bathrooms: [1],
      serviceDate: ['', Validators.required],
      serviceTime: ['', Validators.required],
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
      office: [false],
      laundy: [false],
      folding: [false],
      organizing: [false],
      vacuum: [false],
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
    this.setMinDate();

    this.route.queryParams.subscribe((params) => {
      const type = params['type'];
      const deepCleaning = params['deepCleaning'];

      switch (type) {
        case 'regular':
          this.calculatorForm.get('serviceType')!.setValue('Residential');
          break;
        case 'deep':
          this.calculatorForm.get('serviceType')!.setValue('Residential');
          this.calculatorForm.get('deepCleaning')!.setValue(true);
          break;
        case 'moveIn':
          this.calculatorForm.get('serviceType')!.setValue('Move In');
          break;
        case 'moveOut':
          this.calculatorForm.get('serviceType')!.setValue('Move Out');
          break;
      }

      this.scrollToTop();
    });
  }

  setMinDate(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
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

  setFrequency(frequency: string): void {
    this.calculatorForm.get('frequency')!.setValue(frequency);
    this.calculatePriceAndTime();
  }

  onExtraServiceChanged(extraServiceData: {
    prices: { [key: string]: number };
    times: { [key: string]: number };
    organizingHours: number;
    selectedVacuumOption: string;
  }): void {
    this.extraServicePrices = extraServiceData.prices;
    this.extraServiceTimes = extraServiceData.times;
    this.organizingHours = extraServiceData.organizingHours; // Capture organizing hours
    this.selectedVacuumOption = extraServiceData.selectedVacuumOption; // Capture vacuum option
    this.calculatePriceAndTime();
  }

  onSameDayServiceChanged(isSameDay: boolean): void {
    this.isSameDayService = isSameDay;
    if (isSameDay) {
      this.originalServiceDate = this.calculatorForm.get('serviceDate')!.value;
      const today = new Date().toISOString().split('T')[0];
      this.calculatorForm.get('serviceDate')!.setValue(today);
      this.calculatorForm.get('serviceDate')!.disable();
    } else {
      this.calculatorForm.get('serviceDate')!.enable();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = tomorrow.toISOString().split('T')[0];
      this.calculatorForm.get('serviceDate')!.setValue(tomorrowDateString);
      this.originalServiceDate = null;
    }
  }

  calculatePriceAndTime(): void {
    const formValues = this.calculatorForm.value;
    let basePrice = 0;
    let subTotalTime = 0;

    switch (formValues.serviceType) {
      case 'Residential':
        basePrice += 0;
        subTotalTime += 0;
        break;
      case 'Move In':
        basePrice += 150;
        subTotalTime += 3.5;
        break;
      case 'Move Out':
        basePrice += 150;
        subTotalTime += 3.5;
        break;
      case 'Custom Cleaning':
        basePrice += formValues.cleaners * formValues.hours * 55;
        subTotalTime += formValues.hours;

        // Include same day service and deep cleaning for Custom Cleaning
        if (formValues.sameDay) {
          basePrice += 40;
        }
        if (formValues.deepCleaning) {
          basePrice += 110;
          subTotalTime += 1; // Assuming deep cleaning adds 1 hour
        }

        // Include extra services in Custom Cleaning
        Object.keys(formValues).forEach((service) => {
          if (
            formValues[service] &&
            service !== 'deepCleaning' &&
            service !== 'sameDay' &&
            this.extraServicePrices[service]
          ) {
            basePrice += this.extraServicePrices[service];
            subTotalTime += this.extraServiceTimes[service];
          }
        });
        break;
    }

    let bedroomBasePrice = 0;
    let bedroomTime = 0;

    if (formValues.serviceType !== 'Custom Cleaning') {
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

      const bathrooms = formValues.bathrooms;
      if (bathrooms > 1) {
        const extraBathrooms = bathrooms - 1;
        basePrice += extraBathrooms * 50;
        subTotalTime += extraBathrooms * 0.5;
      }

      if (formValues.deepCleaning) {
        let deepCleaningBase = 110 + bedroomBasePrice;
        switch (formValues.bedrooms) {
          case 'two':
            basePrice += deepCleaningBase * 0.2;
            break;
          case 'three':
            basePrice += deepCleaningBase * 0.3;
            break;
          case 'four':
            basePrice += deepCleaningBase * 0.4;
            break;
          case 'five':
            basePrice += deepCleaningBase * 0.5;
            break;
          case 'six':
            basePrice += deepCleaningBase * 0.6;
            break;
        }
        basePrice += 110;
      }

      // Include extra services for non-custom cleaning
      Object.keys(formValues).forEach((service) => {
        if (
          formValues[service] &&
          service !== 'deepCleaning' &&
          service !== 'sameDay' &&
          this.extraServicePrices[service]
        ) {
          basePrice += this.extraServicePrices[service];
          subTotalTime += this.extraServiceTimes[service];
        }
      });
    }

    const frequencyDiscount =
      this.frequencies.find((freq) => freq.value === formValues.frequency)
        ?.discount || 0;
    const discountAmount = (basePrice * frequencyDiscount) / 100;
    basePrice -= discountAmount;

    const salesTax = basePrice * 0.088;
    const total = basePrice + salesTax;

    this.totalPrice = basePrice;
    this.subTotalTime = subTotalTime;

    if (formValues.serviceType !== 'Custom Cleaning') {
      this.requiredCleaners = Math.ceil(subTotalTime / 5);
      this.totalTime = subTotalTime / this.requiredCleaners;
    } else {
      this.requiredCleaners = formValues.cleaners;
      this.totalTime = subTotalTime;
    }

    this.salesTax = salesTax;
    this.total = total;
  }

  formatTimeToHoursAndMinutes(time: number): string {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours} hours and ${minutes} minutes`;
  }

  formatTimeToAmPm(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  onSubmit(): void {
    if (this.calculatorForm.valid) {
      const formValues = this.calculatorForm.value;

      const booleanToYesNo = (value: boolean) => (value ? 'YES' : 'NO');

      const serviceDate = this.isSameDayService
        ? new Date().toISOString().split('T')[0]
        : formValues.serviceDate;

      const formattedServiceTime = this.formatTimeToAmPm(
        formValues.serviceTime
      );

      const subTotalTimeText = this.isCustomCleaning
        ? '0 hours and 0 minutes'
        : this.formatTimeToHoursAndMinutes(this.subTotalTime ?? 0);

      const totalTimeText = this.isCustomCleaning
        ? ''
        : this.formatTimeToHoursAndMinutes(this.totalTime ?? 0);

      const customCleaningHoursText = this.formatTimeToHoursAndMinutes(
        formValues.hours
      );

      const organizingHoursText = formValues.organizing
        ? this.organizingHours
        : 0;
      const vacuumOptionText = formValues.vacuum
        ? this.selectedVacuumOption
        : 'NO';

      const emailPayload = {
        email: 'ciyvi94@gmail.com', // Recipient email address
        subject: 'New Booking',
        text: `
          Booking Details:
          Service Type: ${formValues.serviceType}
          Bedrooms: ${formValues.bedrooms ?? 'None'}
          Bathrooms: ${formValues.bathrooms ?? 'None'}
          Service Date: ${serviceDate}
          Service Time: ${formattedServiceTime}
          Frequency: ${formValues.frequency}
          Entry Method: ${formValues.entryMethod}
          Special Instructions: ${formValues.specialInstructions}
          Same Day Service: ${booleanToYesNo(formValues.sameDay)}
          Deep Cleaning: ${booleanToYesNo(formValues.deepCleaning)}
          Inside of Closets: ${booleanToYesNo(formValues.insideOfClosets)}
          Inside the Oven: ${booleanToYesNo(formValues.insideTheOven)}
          Inside the Fridge: ${booleanToYesNo(formValues.insideTheFridge)}
          Washing Dishes: ${booleanToYesNo(formValues.washingDishes)}
          Wall Cleaning: ${booleanToYesNo(formValues.wallCleaning)}
          Inside Windows: ${booleanToYesNo(formValues.insideWindows)}
          Pet Hair Clean: ${booleanToYesNo(formValues.petHairClean)}
          Inside Kitchen Cabinets: ${booleanToYesNo(formValues.insideCabinets)}
          Balcony Cleaning: ${booleanToYesNo(formValues.balcony)}
          Use Cleaner Supplies: ${booleanToYesNo(formValues.supplies)}
          Office: ${booleanToYesNo(formValues.office)}
          Laundry: ${booleanToYesNo(formValues.laundy)}
          Folding/Organizing: ${booleanToYesNo(formValues.folding)}
          Hours of Organizing: ${organizingHoursText}
          Bring Vacuum Cleaner: ${vacuumOptionText}
          Number of Cleaners: ${this.requiredCleaners}
          Number of Hours: ${
            this.isCustomCleaning ? customCleaningHoursText : 'N/A'
          }
          ${!this.isCustomCleaning ? `Sub-total Time: ${subTotalTimeText}` : ''}
          ${!this.isCustomCleaning ? `Total Time: ${totalTimeText}` : ''}
          Sub-total Price: ${this.totalPrice}
          Sales Tax: ${this.salesTax}
          Total Price: ${this.total}
        `,
      };

      this.http
        .post('http://localhost:3000/send-email', emailPayload)
        .subscribe(
          (response) => {
            console.log('Email sent successfully', response);
          },
          (error) => {
            console.error('Error sending email', error);
          }
        );
    } else {
      this.calculatorForm.markAllAsTouched();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
