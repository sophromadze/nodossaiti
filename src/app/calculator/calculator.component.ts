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
    { value: 'Monthly', label: 'Monthly Discount 3%', discount: 99.347 }, // 3 უნდა ეწეროს აქ!!! სატესტოდაა ჯერ.
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
  deepCleaningChecked = false; // Add this line
  requiredCleaners: number | null = null;
  extraServicePrices: { [key: string]: number } = {};
  extraServiceTimes: { [key: string]: number } = {};
  originalServiceDate: string | null = null;
  organizingHours: number | null = 0; // Initialize organizing hours
  insideWindowsNumbers: number | null = 0; // Initialize windows number
  selectedVacuumOption: string = 'None'; // Initialize vacuum option

  showPaymentForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.calculatorForm = this.fb.group({
      serviceType: ['', Validators.required],
      bedrooms: ['studio'],
      bathrooms: [1],
      serviceDate: [
        { value: '', disabled: this.isSameDayService },
        Validators.required,
      ],
      serviceTime: ['', Validators.required],
      frequency: ['One Time', Validators.required],
      entryMethod: ['', Validators.required],
      // discountCode: [''],
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

    this.calculatorForm.get('deepCleaning')!.valueChanges.subscribe((value) => {
      this.deepCleaningChecked = value;
      this.calculatePriceAndTime();
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
    insideWindowsNumbers: number;
    selectedVacuumOption: string;
  }): void {
    this.extraServicePrices = extraServiceData.prices;
    this.extraServiceTimes = extraServiceData.times;
    this.organizingHours = extraServiceData.organizingHours; // Capture organizing hours
    this.insideWindowsNumbers = extraServiceData.insideWindowsNumbers; // Capture windows numbers
    this.selectedVacuumOption = extraServiceData.selectedVacuumOption; // Capture vacuum option
    this.calculatePriceAndTime();
  }

  onSameDayServiceChanged(isSameDay: boolean): void {
    this.isSameDayService = isSameDay;
    if (isSameDay) {
      this.originalServiceDate = this.calculatorForm.get('serviceDate')!.value;
      const today = new Date().toISOString().split('T')[0];
      this.calculatorForm.get('serviceDate')!.setValue(today);
      this.calculatorForm.get('serviceDate')!.disable({ emitEvent: false });
    } else {
      this.calculatorForm.get('serviceDate')!.enable({ emitEvent: false });
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
        let hourlyRate = 55;
        if (formValues.deepCleaning) {
          hourlyRate = 75; // Increase hourly rate if deep cleaning is selected
        }
        basePrice += formValues.cleaners * formValues.hours * hourlyRate;
        subTotalTime += formValues.hours;
        break;
    }

    if (formValues.serviceType !== 'Custom Cleaning') {
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
    }

    // Include extra services for both custom and non-custom cleaning
    Object.keys(formValues).forEach((service) => {
      if (
        formValues[service] &&
        this.extraServicePrices[service] // Ensure the extra service has a price
      ) {
        basePrice += this.extraServicePrices[service];
        subTotalTime += this.extraServiceTimes[service];
      }
    });

    const frequencyDiscount =
      this.frequencies.find((freq) => freq.value === formValues.frequency)
        ?.discount || 0;
    const discountAmount = (basePrice * frequencyDiscount) / 100;
    basePrice -= discountAmount;

    const salesTax = basePrice * 0.0888;
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

  onBookNowClick(): void {
    if (this.calculatorForm.invalid) {
      this.calculatorForm.markAllAsTouched();
    } else {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.calculatorForm.valid) {
      this.openPaymentForm();
    }
  }

  openPaymentForm(): void {
    this.showPaymentForm = true;
  }

  closePaymentForm(): void {
    this.showPaymentForm = false;
  }

  onPaymentSuccess(event: any): void {
    this.sendEmail();
    this.calculatorForm.reset({
      serviceType: '',
      bedrooms: 'studio',
      bathrooms: 1,
      serviceDate: '',
      serviceTime: '',
      frequency: 'One Time',
      entryMethod: '',
      specialInstructions: '',
      sameDay: false,
      deepCleaning: false,
      insideOfClosets: false,
      insideTheOven: false,
      insideTheFridge: false,
      washingDishes: false,
      wallCleaning: false,
      insideWindows: false,
      petHairClean: false,
      insideCabinets: false,
      balcony: false,
      supplies: false,
      office: false,
      laundy: false,
      folding: false,
      organizing: false,
      vacuum: false,
      cleaners: 1,
      hours: 3,
    });
    // this.closePaymentForm();
  }

  sendEmail(): void {
    const formValues = this.calculatorForm.value;

    const contactInfo = this.calculatorForm.get('contactInfo')?.value;
    const addressInfo = this.calculatorForm.get('addressInfo')?.value;

    const booleanToYesNo = (value: boolean) => (value ? 'YES' : 'NO');

    const serviceDate = this.isSameDayService
      ? new Date().toISOString().split('T')[0]
      : formValues.serviceDate;

    const formattedServiceTime = this.formatTimeToAmPm(formValues.serviceTime);

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
    const insideWindowsText = formValues.insideWindows
      ? this.insideWindowsNumbers
      : 0;
    const vacuumOptionText = formValues.vacuum
      ? this.selectedVacuumOption
      : 'NO';

    // Function to conditionally include information based on boolean value
    const conditionalInclude = (label: string, value: boolean) => {
      return value ? `${label}: ${booleanToYesNo(value)}\n` : '';
    };

    const extraServicesText = [
      conditionalInclude('Same Day Service', formValues.sameDay),
      conditionalInclude('Deep Cleaning', formValues.deepCleaning),
      conditionalInclude('Inside of Closets', formValues.insideOfClosets),
      conditionalInclude('Inside the Oven', formValues.insideTheOven),
      conditionalInclude('Inside the Fridge', formValues.insideTheFridge),
      conditionalInclude('Washing Dishes', formValues.washingDishes),
      conditionalInclude('Wall Cleaning', formValues.wallCleaning),
      conditionalInclude('Pet Hair Clean', formValues.petHairClean),
      conditionalInclude('Inside Kitchen Cabinets', formValues.insideCabinets),
      conditionalInclude('Balcony Cleaning', formValues.balcony),
      conditionalInclude('Use Cleaner Supplies', formValues.supplies),
      conditionalInclude('Office', formValues.office),
      conditionalInclude('Laundry', formValues.laundy),
      conditionalInclude('Folding/Organizing', formValues.folding),
    ]
      .filter(Boolean)
      .join('\n');

    // Retrieve displayed text of city, state, and entry method select elements
    const cityElement = document.querySelector(
      '#city option:checked'
    ) as HTMLOptionElement;
    const stateElement = document.querySelector(
      '#state option:checked'
    ) as HTMLOptionElement;
    const entryMethodElement = document.querySelector(
      '#entryMethod option:checked'
    ) as HTMLOptionElement;

    const cityText = cityElement ? cityElement.textContent : 'N/A';
    const stateText = stateElement ? stateElement.textContent : 'N/A';
    const entryMethodText = entryMethodElement
      ? entryMethodElement.textContent
      : 'N/A';

    const emailText = `
        Booking Details:

        Service Type: ${formValues.serviceType}
        Bedrooms: ${formValues.bedrooms ?? 'None'}
        Bathrooms: ${formValues.bathrooms ?? 'None'}
        Service Date: ${serviceDate}
        Service Time: ${formattedServiceTime}
        Frequency: ${formValues.frequency}
        Entry Method: ${entryMethodText}
        Special Instructions: ${formValues.specialInstructions || 'None'}
        ${extraServicesText}
        Inside Windows: ${insideWindowsText}
        Hours of Organizing: ${organizingHoursText}
        Bring Vacuum Cleaner: ${vacuumOptionText}
        Number of Cleaners: ${this.requiredCleaners}
        Number of Hours: ${
          this.isCustomCleaning ? customCleaningHoursText : 'N/A'
        }
        ${!this.isCustomCleaning ? `Sub-total Time: ${subTotalTimeText}\n` : ''}
        ${!this.isCustomCleaning ? `Total Time: ${totalTimeText}\n` : ''}
        Sub-total Price: $${this.totalPrice?.toFixed(2)}
        Sales Tax: $${this.salesTax?.toFixed(2)}
        Total Price: $${this.total?.toFixed(2)}

        Contact Info:
        
        Name: ${contactInfo.name}
        Last Name: ${contactInfo.lastName}
        Email: ${contactInfo.email}
        Cell Number: ${contactInfo.cellNumber || 'None'}

        Address Info:

        Address: ${addressInfo.address}
        Apartment: ${addressInfo.apartment || 'N/A'}
        City: ${cityText}
        State: ${stateText}
        Zip Code: ${addressInfo.zipCode}
    `;

    const clientEmailText = `
        Thank you for booking with us!

        Here are your booking details:

        Service Type: ${formValues.serviceType}
        Bedrooms: ${formValues.bedrooms ?? 'None'}
        Bathrooms: ${formValues.bathrooms ?? 'None'}
        Service Date: ${serviceDate}
        Service Time: ${formattedServiceTime}
        Frequency: ${formValues.frequency}
        Entry Method: ${entryMethodText}
        Special Instructions For Cleaners: ${
          formValues.specialInstructions || 'None'
        }
        ${extraServicesText}
        Inside Windows: ${insideWindowsText}
        Hours of Organizing: ${organizingHoursText}
        Bring Vacuum Cleaner: ${vacuumOptionText}
        Number of Cleaners: ${this.requiredCleaners}
        Number of Hours: ${
          this.isCustomCleaning ? customCleaningHoursText : 'N/A'
        }
        ${!this.isCustomCleaning ? `Sub-total Time: ${subTotalTimeText}\n` : ''}
        ${!this.isCustomCleaning ? `Total Time: ${totalTimeText}\n` : ''}
        Sub-total Price: $${this.totalPrice?.toFixed(2)}
        Sales Tax: $${this.salesTax?.toFixed(2)}
        Total Price: $${this.total?.toFixed(2)}

        Contact Info:
        
        Your Name: ${contactInfo.name}
        Your Last Name: ${contactInfo.lastName}
        Your Email: ${contactInfo.email}
        Your Cell Number: ${contactInfo.cellNumber || 'None'}

        Address Info:

        Your Address: ${addressInfo.address}
        Your Apartment: ${addressInfo.apartment || 'N/A'}
        Your City: ${cityText}
        Your State: ${stateText}
        Your Zip Code: ${addressInfo.zipCode}
    `;

    const yourEmailPayload = {
      email: 'DreamCleaningInfos@gmail.com', // Your email address
      subject: 'New Booking',
      text: emailText,
    };

    const clientEmailPayload = {
      email: contactInfo.email, // Client's email address
      subject: 'Booking Confirmation',
      text: clientEmailText,
      from: 'DreamCleaningInfos@gmail.com', // Ensure this field is added
    };

    // Send email to you
    this.http
      .post('http://localhost:3000/send-email', yourEmailPayload)
      .subscribe(
        (response) => {
          console.log('Email sent to you successfully', response);
        },
        (error) => {
          console.error('Error sending email to you', error);
        }
      );

    // Send email to the client
    this.http
      .post('http://localhost:3000/send-email', clientEmailPayload)
      .subscribe(
        (response) => {
          console.log('Email sent to client successfully', response);
        },
        (error) => {
          console.error('Error sending email to client', error);
        }
      );
  }
}
