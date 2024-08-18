import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import flatpickr from 'flatpickr';
import { ExtraServicesComponent } from './extra-services/extra-services.component';
import { environment } from 'src/environments/environment.development';
import { StripePaymentService } from '../stripe-payment.service'; // Import the service

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit, AfterViewInit {
  @ViewChild(ExtraServicesComponent)
  extraServicesComponent!: ExtraServicesComponent;
  calculatorForm: FormGroup;
  private inputTimeout: any;
  minDate!: string;
  isSameDayService: boolean = false;
  showTooltip: boolean = false;
  isDeepCleaningSelected: boolean = false;
  totalPrice: number | null = null;
  subTotalTime: number | null = null;
  totalTime: number | null = null;
  salesTax: number | null = null;
  total: number | null = null;
  tips: number = 0;
  isCustomCleaning: boolean = false;
  deepCleaningChecked: boolean = false;
  requiredCleaners: number | null = null;
  originalServiceDate: string | null = null;
  organizingHours: number | null = 0;
  insideWindowsNumbers: number | null = 0;
  wallsNumbers: number | null = 0;
  isFixed: boolean = true;
  showPaymentForm: boolean = false;
  showPaymentMethodSelection: boolean = false;
  showPayPalForm: boolean = false;
  showCreditCardForm: boolean = false;

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
  squareFeetOptions: Array<{ value: string; label: string }> = [];
  bathroomOptions = [1, 2, 3, 4, 5, 6];
  isFocused: boolean = false;
  frequencies = [
    { value: 'One Time', label: 'One Time', discount: 0 },
    { value: 'Weekly', label: 'Weekly 10% Discount', discount: 10 },
    { value: 'Every 2 Weeks', label: 'Every 2 Weeks 8% Discount', discount: 8 },
    { value: 'Every 3 Weeks', label: '3 Weekly 5.5%', discount: 5.5 },
    { value: 'Monthly', label: 'Monthly Discount 3%', discount: 3 },
  ];
  discounts = [
    {
      value: 'First Time',
      label: 'First Time Service',
      discount: 20,
    },
  ];
  cleanersOptions = [1, 2, 3, 4, 5];
  hoursOptions = [
    3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
    12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19,
    19.5, 20,
  ];
  optionsStudio = [
    { value: '<400', label: '< 400 sq.ft' },
    { value: '401-650', label: '401-650 sq.ft' },
    { value: '651-900', label: '651-900 sq.ft' },
  ];
  optionsOne = [
    { value: '<650', label: '< 650 sq.ft' },
    { value: '651-900', label: '651-900 sq.ft' },
    { value: '901-1200', label: '901-1200 sq.ft' },
    { value: '1201-1500', label: '1201-1500 sq.ft' },
    { value: '1501-2000', label: '1501-2000 sq.ft' },
  ];
  optionsTwo = [
    { value: '<850', label: '< 850 sq.ft' },
    { value: '851-1000', label: '851-1000 sq.ft' },
    { value: '1001-1300', label: '1001-1300 sq.ft' },
    { value: '1301-1600', label: '1301-1600 sq.ft' },
    { value: '1601-2000', label: '1601-2000 sq.ft' },
  ];
  optionsThree = [
    { value: '<1000', label: '< 1000 sq.ft' },
    { value: '1001-1300', label: '1001-1300 sq.ft' },
    { value: '1301-1600', label: '1301-1600 sq.ft' },
    { value: '1601-2000', label: '1601-2000 sq.ft' },
    { value: '2001-2400', label: '2001-2400 sq.ft' },
    { value: '2401-3000', label: '2401-3000 sq.ft' },
    { value: '3001-3500', label: '3001-3500 sq.ft' },
    { value: '3501-4000', label: '3501-4000 sq.ft' },
    { value: '4001-5000', label: '4001-5000 sq.ft' },
  ];
  optionsFour = [
    { value: '<1500', label: '< 1500 sq.ft' },
    { value: '1500-1800', label: '1500-1800 sq.ft' },
    { value: '1801-2100', label: '1801-2100 sq.ft' },
    { value: '2101-2500', label: '2101-2500 sq.ft' },
    { value: '2501-3000', label: '2501-3000 sq.ft' },
    { value: '3001-3500', label: '3001-3500 sq.ft' },
    { value: '3501-4000', label: '3501-4000 sq.ft' },
    { value: '4001+', label: '> 4001 sq.ft' },
  ];
  optionsFive = [
    { value: '<1800', label: '< 1800 sq.ft' },
    { value: '1800-2100', label: '1800-2100 sq.ft' },
    { value: '2101-2500', label: '2101-2500 sq.ft' },
    { value: '2501-2900', label: '2501-2900 sq.ft' },
    { value: '2901-3300', label: '2901-3300 sq.ft' },
    { value: '3301-3800', label: '3301-3800 sq.ft' },
    { value: '3801-4200', label: '3801-4200 sq.ft' },
    { value: '4201-5000', label: '4201-5000 sq.ft' },
  ];
  optionsSix = [
    { value: '<2000', label: '< 2000 sq.ft' },
    { value: '2001-2500', label: '2001-2500 sq.ft' },
    { value: '2501-3000', label: '2501-3000 sq.ft' },
    { value: '3001-3500', label: '3001-3500 sq.ft' },
    { value: '3501-4000', label: '3501-4000 sq.ft' },
    { value: '4001-5000', label: '4001-5000 sq.ft' },
    { value: '5001+', label: '> 5001 sq.ft' },
  ];
  squareFeetPriceValues: { [key: string]: number } = {
    'studio_<400': 50,
    'studio_401-650': 90,
    'studio_651-900': 130,
    'one_<650': 50,
    'one_651-900': 90,
    'one_901-1200': 130,
    'one_1201-1500': 170,
    'one_1501-2000': 230,
    'two_<850': 50,
    'two_851-1000': 90,
    'two_1001-1300': 130,
    'two_1301-1600': 170,
    'two_1601-2000': 210,
    'three_<1000': 50,
    'three_1001-1300': 90,
    'three_1301-1600': 130,
    'three_1601-2000': 170,
    'three_2001-2400': 210,
    'three_2401-3000': 270,
    'three_3001-3500': 330,
    'three_3501-4000': 370,
    'three_4001-5000': 450,
    'four_<1500': 50,
    'four_1500-1800': 90,
    'four_1801-2100': 130,
    'four_2101-2500': 170,
    'four_2501-3000': 210,
    'four_3001-3500': 250,
    'four_3501-4000': 290,
    'four_4001+': 370,
    'five_<1800': 50,
    'five_1800-2100': 90,
    'five_2101-2500': 130,
    'five_2501-2900': 170,
    'five_2901-3300': 210,
    'five_3301-3800': 270,
    'five_3801-4200': 310,
    'five_4201-5000': 370,
    'six_<2000': 50,
    'six_2001-2500': 130,
    'six_2501-3000': 170,
    'six_3001-3500': 250,
    'six_3501-4000': 330,
    'six_4001-5000': 410,
    'six_5001+': 490,
  };
  squareFeetTimeValues: { [key: string]: number } = {
    'studio_<400': 0.5,
    'studio_401-650': 1.5,
    'studio_651-900': 2.5,
    'one_<650': 0.5,
    'one_651-900': 1.5,
    'one_901-1200': 2.5,
    'one_1201-1500': 3.5,
    'one_1501-2000': 5,
    'two_<850': 0.5,
    'two_851-1000': 1.5,
    'two_1001-1300': 2.5,
    'two_1301-1600': 3.5,
    'two_1601-2000': 4.5,
    'three_<1000': 1,
    'three_1001-1300': 2,
    'three_1301-1600': 3,
    'three_1601-2000': 4,
    'three_2001-2400': 5,
    'three_2401-3000': 6.5,
    'three_3001-3500': 8,
    'three_3501-4000': 9,
    'three_4001-5000': 11,
    'four_<1500': 1,
    'four_1500-1800': 2,
    'four_1801-2100': 3,
    'four_2101-2500': 4,
    'four_2501-3000': 5,
    'four_3001-3500': 6,
    'four_3501-4000': 7,
    'four_4001+': 9,
    'five_<1800': 1,
    'five_1800-2100': 2,
    'five_2101-2500': 3,
    'five_2501-2900': 4,
    'five_2901-3300': 5,
    'five_3301-3800': 6.5,
    'five_3801-4200': 7.5,
    'five_4201-5000': 9,
    'six_<2000': 1,
    'six_2001-2500': 3,
    'six_2501-3000': 4,
    'six_3001-3500': 6,
    'six_3501-4000': 8,
    'six_4001-5000': 10,
    'six_5001+': 12,
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private stripeService: StripePaymentService
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Function to get month name
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[tomorrow.getMonth()];
    const day = tomorrow.getDate();
    const year = tomorrow.getFullYear();
    const tomorrowDateString = `${month}-${day}-${year}`;

    this.calculatorForm = this.fb.group({
      serviceType: ['Residential', Validators.required],
      bedrooms: ['studio', Validators.required],
      bathrooms: [1, Validators.required],
      squareFeet: ['<400', Validators.required],
      serviceDate: [tomorrowDateString, Validators.required],
      serviceTime: ['09:00', Validators.required],
      frequency: ['One Time', Validators.required],
      discount: [''],
      entryMethod: ['', Validators.required],
      // discountCode: [''],
      specialInstructions: [''],
      sameDay: [false],
      deepCleaning: [false],
      insideOfClosets: [false],
      insideTheOven: [false],
      insideTheFridge: [false],
      washingDishes: [false],
      wallCleaning: [null],
      insideWindows: [null],
      petHairClean: [false],
      insideCabinets: [false],
      balcony: [false],
      supplies: [false],
      office: [false],
      laundry: [false],
      folding: [false],
      organizing: [null],
      // vacuum: [false],
      vacuum2: [false],
      cleaners: [1],
      hours: [3],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellNumber: [
        '',
        [
          Validators.required,
          this.cellNumberValidator,
          Validators.pattern(/^\d+$/),
        ],
      ],
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      state: ['NY', Validators.required],
      zipCode: ['', Validators.required],
      tips: [0],
      receiveMessages: [false],
    });

    this.calculatorForm.get('serviceType')!.valueChanges.subscribe(() => {
      this.onServiceTypeChange();
    });

    this.calculatorForm.get('bedrooms')!.valueChanges.subscribe(() => {
      this.updateSquareFeetOptions();
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
    this.updateMaxWidth();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const month = monthNames[tomorrow.getMonth()];
    const day = tomorrow.getDate();
    const year = tomorrow.getFullYear();
    const tomorrowDateString = `${month}-${day}-${year}`;

    this.route.queryParams.subscribe((params) => {
      function formatDateToMDY(date: Date): string {
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      }

      const today = formatDateToMDY(new Date());

      this.calculatorForm
        .get('serviceDate')!
        .valueChanges.subscribe((value) => {
          value === today
            ? this.calculatorForm.get('sameDay')!.setValue(true)
            : this.calculatorForm.get('sameDay')!.setValue(false);
        });

      this.calculatorForm.get('tips')!.valueChanges.subscribe((value) => {
        if (value < 10 && value > 0) {
          // Clear previous timeout to prevent multiple timeouts
          clearTimeout(this.inputTimeout);

          this.inputTimeout = setTimeout(() => {
            this.calculatorForm.get('tips')!.setValue(10);
          }, 50);
        }
      });

      const sanitizedCellNumber = params['cellNumber']
        ? params['cellNumber'].replace(/[^0-9]/g, '')
        : '';

      const sameDay = this.parseBoolean(params['sameDay']);
      const deepCleaning = this.parseBoolean(params['deepCleaning']);
      const insideOfClosets = this.parseBoolean(params['insideOfClosets']);
      const insideTheOven = this.parseBoolean(params['insideTheOven']);
      const insideTheFridge = this.parseBoolean(params['insideTheFridge']);
      const washingDishes = this.parseBoolean(params['washingDishes']);
      const wallCleaning = params['wallCleaning']
        ? parseInt(params['wallCleaning'], 10)
        : null;
      const insideWindows = params['insideWindows']
        ? parseInt(params['insideWindows'], 10)
        : null;
      const petHairClean = this.parseBoolean(params['petHairClean']);
      const insideCabinets = this.parseBoolean(params['insideCabinets']);
      const balcony = this.parseBoolean(params['balcony']);
      const supplies = this.parseBoolean(params['supplies']);
      const office = this.parseBoolean(params['office']);
      const laundry = this.parseBoolean(params['laundry']);
      const folding = this.parseBoolean(params['folding']);
      const organizing = params['organizing']
        ? parseFloat(params['organizing'])
        : null;
      const vacuum2 = this.parseBoolean(params['vacuum2']);

      this.calculatorForm.setValue({
        serviceType: params['serviceType'] || 'Residential',
        bedrooms: params['bedrooms'] || 'studio',
        bathrooms: params['bathrooms'] || 1,
        squareFeet: params['squareFeet'] || '<400',
        serviceDate: params['serviceDate'] || tomorrowDateString,
        serviceTime: params['serviceTime'] || '9:00' + ' ' + 'AM',
        frequency: params['frequency'] || 'One Time',
        discount: params['discount'] || null,
        entryMethod: params['entryMethod'] || '',
        specialInstructions: params['specialInstructions'] || null,
        sameDay: sameDay,
        deepCleaning: deepCleaning,
        insideOfClosets: insideOfClosets,
        insideTheOven: insideTheOven,
        insideTheFridge: insideTheFridge,
        washingDishes: washingDishes,
        wallCleaning: wallCleaning,
        insideWindows: insideWindows,
        petHairClean: petHairClean,
        insideCabinets: insideCabinets,
        balcony: balcony,
        supplies: supplies,
        office: office,
        laundry: laundry,
        folding: folding,
        organizing: organizing,
        vacuum2: vacuum2,
        cleaners: params['cleaners'] || 1,
        hours: params['hours'] || 3,
        name: params['name'] || null,
        lastName: params['lastName'] || null,
        email: params['email'] || null,
        cellNumber: sanitizedCellNumber || null,
        address: params['address'] || null,
        apartment: params['apartment'] || null,
        city: params['city'] || '',
        state: params['state'] || 'NY',
        zipCode: params['zipCode'] || null,
        tips: params['tips'] ? parseFloat(params['tips']) : '0',
        receiveMessages: params['receiveMessages'] || null,
      });

      const type = params['type'];

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
        case 'custom':
          this.calculatorForm.get('serviceType')!.setValue('Custom Cleaning');
          break;
      }

      this.organizingHours = organizing;
      this.insideWindowsNumbers = insideWindows;
      this.wallsNumbers = wallCleaning;

      this.updateSquareFeetOptions();
      this.cdr.detectChanges();
      this.calculatePriceAndTime();
    });

    this.calculatorForm.valueChanges.subscribe(() => {
      const cellNumber = this.calculatorForm.value.cellNumber || '';
      const sanitizedCellNumber = cellNumber.replace(/[^0-9]/g, '');

      this.updateUrlWithoutHistory({
        serviceType: this.calculatorForm.value.serviceType || null,
        bedrooms: this.calculatorForm.value.bedrooms || null,
        bathrooms: this.calculatorForm.value.bathrooms || null,
        squareFeet: this.calculatorForm.value.squareFeet || null,
        serviceDate: this.calculatorForm.value.serviceDate || null,
        serviceTime: this.calculatorForm.value.serviceTime || null,
        frequency: this.calculatorForm.value.frequency || null,
        discount: this.calculatorForm.value.discount || null,
        entryMethod: this.calculatorForm.value.entryMethod || null,
        specialInstructions:
          this.calculatorForm.value.specialInstructions || null,
        sameDay: this.calculatorForm.value.sameDay || null,
        deepCleaning: this.calculatorForm.value.deepCleaning || null,
        insideOfClosets: this.calculatorForm.value.insideOfClosets || null,
        insideTheOven: this.calculatorForm.value.insideTheOven || null,
        insideTheFridge: this.calculatorForm.value.insideTheFridge || null,
        washingDishes: this.calculatorForm.value.washingDishes || null,
        wallCleaning: this.calculatorForm.value.wallCleaning || null,
        insideWindows: this.calculatorForm.value.insideWindows || null,
        petHairClean: this.calculatorForm.value.petHairClean || null,
        insideCabinets: this.calculatorForm.value.insideCabinets || null,
        balcony: this.calculatorForm.value.balcony || null,
        supplies: this.calculatorForm.value.supplies || null,
        office: this.calculatorForm.value.office || null,
        laundry: this.calculatorForm.value.laundry || null,
        folding: this.calculatorForm.value.folding || null,
        organizing: this.calculatorForm.value.organizing || null,
        vacuum2: this.calculatorForm.value.vacuum2 || null,
        cleaners: this.calculatorForm.value.cleaners || null,
        hours: this.calculatorForm.value.hours || null,
        name: this.calculatorForm.value.name || null,
        lastName: this.calculatorForm.value.lastName || null,
        email: this.calculatorForm.value.email || null,
        cellNumber: sanitizedCellNumber || null,
        address: this.calculatorForm.value.address || null,
        apartment: this.calculatorForm.value.apartment || null,
        city: this.calculatorForm.value.city || null,
        state: this.calculatorForm.value.state || null,
        zipCode: this.calculatorForm.value.zipCode || null,
        tips: this.calculatorForm.value.tips || null,
        receiveMessages: this.calculatorForm.value.receiveMessages || null,
      });

      this.cdr.detectChanges(); //saechvoa
      this.calculatePriceAndTime();
    });

    this.updateSquareFeetOptions();

    window.scrollTo(0, 0);
    this.calculatorForm.get('discount')!.valueChanges.subscribe((discount) => {
      if (discount === 'First Time') {
        this.calculatorForm.get('frequency')!.setValue('One Time');
      }
    });

    // Subscribe to changes in the frequency control
    this.calculatorForm
      .get('frequency')!
      .valueChanges.subscribe((frequency) => {
        const discountControl = this.calculatorForm.get('discount')!;
        if (
          frequency !== 'One Time' &&
          discountControl.value === 'First Time'
        ) {
          discountControl.setValue(null); // Uncheck the "First Time" discount
        }
      });

    this.calculatePriceAndTime();
  }

  ngAfterViewInit(): void {
    this.initializeFlatpickr();
    this.checkScroll();
    this.updateMaxWidth();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.updateMaxWidth();
  }

  checkScroll() {
    const footerElement = document.querySelector(
      '.footerContainer'
    ) as HTMLElement;
    const fixedDivElement = document.querySelector(
      '.calculator-card'
    ) as HTMLElement;

    if (footerElement && fixedDivElement) {
      const footerRect = footerElement.getBoundingClientRect();
      const fixedDivRect = fixedDivElement.getBoundingClientRect();
      const offset = 10; // Margin from the footer

      if (window.innerWidth < 900 || window.innerHeight < 700) {
        this.isFixed = false;
        fixedDivElement.style.position = 'sticky';
        fixedDivElement.style.bottom = '0';
        fixedDivElement.style.right = '0';
      } else {
        if (footerRect.top <= window.innerHeight - offset) {
          this.isFixed = false;
          fixedDivElement.style.position = 'absolute';
          fixedDivElement.style.bottom = '0';
          fixedDivElement.style.right = '0';
        } else {
          this.isFixed = true;
          fixedDivElement.style.position = 'fixed';
          fixedDivElement.style.bottom = '0';

          if (window.innerWidth < 1150) {
            fixedDivElement.style.right = '10px';
          } else {
            fixedDivElement.style.right = '50px';
          }
        }
      }
      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  updateMaxWidth() {
    const fixedDivElement = this.el.nativeElement.querySelector(
      '.calculator-card'
    ) as HTMLElement;
    const contentElement = document.querySelector('.card-width') as HTMLElement;

    if (contentElement && fixedDivElement) {
      const contentWidth = contentElement.clientWidth; // Get the width of the content element
      this.renderer.setStyle(fixedDivElement, 'width', `${contentWidth}px`);
    }
  }

  onExtraServiceChanged(extraServiceData: {
    prices: { [key: string]: number };
    times: { [key: string]: number };
    organizingHours: number;
    insideWindowsNumbers: number;
    wallsNumbers: number;
  }): void {
    this.extraServicePrices = extraServiceData.prices;
    this.extraServiceTimes = extraServiceData.times;
    this.organizingHours = extraServiceData.organizingHours;
    this.insideWindowsNumbers = extraServiceData.insideWindowsNumbers;
    this.wallsNumbers = extraServiceData.wallsNumbers;
    this.calculatePriceAndTime();
  }

  onSameDayServiceChanged(isSameDay: boolean): void {
    function formatDateToMDY(date: Date): string {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    }

    this.isSameDayService = isSameDay;
    if (isSameDay) {
      const today = formatDateToMDY(new Date());
      this.originalServiceDate = this.calculatorForm.get('serviceDate')!.value;
      this.calculatorForm.get('serviceDate')!.setValue(today);
      // this.calculatorForm.get('serviceDate')!.disable({ emitEvent: false });
    } else {
      this.calculatorForm.get('serviceDate')!.enable({ emitEvent: false });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = formatDateToMDY(tomorrow);
      this.calculatorForm.get('serviceDate')!.setValue(tomorrowDateString);
      this.originalServiceDate = null;
    }
  }

  toggleDiscount(discount: string): void {
    const discountControl = this.calculatorForm.get('discount')!;
    const frequencyControl = this.calculatorForm.get('frequency')!;

    if (discountControl.value === discount) {
      discountControl.setValue(null); // Unselect if already selected
    } else {
      discountControl.setValue(discount); // Select the new discount

      if (discount === 'First Time') {
        frequencyControl.setValue('One Time'); // Set frequency to One Time if First Time discount is selected
      }
    }
  }

  setDiscount(discount: string | null): void {
    this.calculatorForm.get('discount')!.setValue(discount);
    this.calculatePriceAndTime();
  }

  setFrequency(frequency: string): void {
    this.calculatorForm.get('frequency')!.setValue(frequency);
    this.calculatePriceAndTime();
  }

  cellNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^\d{10}$/.test(value)) {
      return { cellNumberInvalid: true };
    }
    return null;
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
    this.updateSquareFeetOptions();
    this.calculatePriceAndTime();
  }

  updateSquareFeetOptions(): void {
    const bedrooms = this.calculatorForm.get('bedrooms')!.value;

    switch (bedrooms) {
      case 'studio':
        this.squareFeetOptions = this.optionsStudio;
        break;
      case 'one':
        this.squareFeetOptions = this.optionsOne;
        break;
      case 'two':
        this.squareFeetOptions = this.optionsTwo;
        break;
      case 'three':
        this.squareFeetOptions = this.optionsThree;
        break;
      case 'four':
        this.squareFeetOptions = this.optionsFour;
        break;
      case 'five':
        this.squareFeetOptions = this.optionsFive;
        break;
      case 'six':
        this.squareFeetOptions = this.optionsSix;
        break;
    }
    // Preserve the current squareFeet value if it is a valid option
    const currentSquareFeet = this.calculatorForm.get('squareFeet')!.value;
    const isValidOption = this.squareFeetOptions.some(
      (option) => option.value === currentSquareFeet
    );

    if (!isValidOption) {
      if (this.squareFeetOptions.length > 0) {
        this.calculatorForm
          .get('squareFeet')!
          .setValue(this.squareFeetOptions[0].value);
      } else {
        this.calculatorForm.get('squareFeet')!.setValue('');
      }
    }
  }

  setMinDate(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  parseBoolean(value: any): boolean {
    return value === 'true' || value === true;
  }

  updateUrlWithoutHistory(queryParams: any): void {
    const url = this.router.createUrlTree([], { queryParams }).toString();
    this.location.replaceState(url);
  }

  onFocus(): void {
    this.isFocused = true;
    this.runChangeDetection();
  }

  onBlur(): void {
    const cellNumberControl = this.calculatorForm.get('cellNumber');
    if (!cellNumberControl!.value || cellNumberControl!.value.length === 0) {
      this.isFocused = false;
      this.runChangeDetection();
    }
  }

  onCellNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    // Limit to the first 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Set the numeric value in the form control
    this.calculatorForm
      .get('cellNumber')!
      .setValue(value, { emitEvent: false });

    // Update focus state based on value length
    this.isFocused = true;
    this.runChangeDetection();
  }

  private runChangeDetection(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  onTipsInput(event: any): void {
    const input = event.target;
    const tipsControl = this.calculatorForm.get('tips');
    let tipsValue = input.value;

    // Remove non-integer characters and leading zeros
    tipsValue = tipsValue.replace(/[^0-9]/g, '').replace(/^0+/, '');

    // Update the form control value with the filtered input
    tipsControl?.setValue(tipsValue, { emitEvent: false });

    // Clear previous timeout to prevent multiple timeouts
    clearTimeout(this.inputTimeout);

    // Set a new timeout to check the value after 2 seconds
    this.inputTimeout = setTimeout(() => {
      if (
        tipsValue !== null &&
        tipsValue !== '' &&
        +tipsValue > 0 &&
        +tipsValue < 10
      ) {
        tipsValue = '10';
        tipsControl?.setValue(tipsValue, { emitEvent: true });
        input.value = tipsValue; // Ensure the input field is updated
      }
    }, 2000);
  }

  // Method to get the label for bedrooms
  getBedroomLabel(bedroomValue: string): string {
    const bedroomLabels: { [key: string]: string } = {
      studio: 'Studio Clean',
      one: 'One Bedroom Clean',
      two: 'Two Bedrooms Clean',
      three: 'Three Bedrooms Clean',
      four: 'Four Bedrooms Clean',
      five: 'Five Bedrooms Clean',
      six: 'Six Bedrooms Clean',
    };
    return bedroomLabels[bedroomValue] || bedroomValue;
  }

  // Method to get the display text for service type
  getServiceTypeDisplay(): string {
    if (this.isCustomCleaning) {
      return 'Custom Cleaning Service';
    }
    const bedrooms = this.calculatorForm.get('bedrooms')!.value;
    return `${this.getBedroomLabel(bedrooms)}`;
  }

  initializeFlatpickr(): void {
    const dateInput = this.el.nativeElement.querySelector('#datePickerWrapper');
    const timeInput = this.el.nativeElement.querySelector('#timePickerWrapper');

    // Create a new date object representing tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateInput) {
      flatpickr(dateInput, {
        enableTime: false,
        dateFormat: 'M-d-Y',
        minDate: tomorrow,
        wrap: true,
        disableMobile: true,
        onDayCreate: function (dObj, dStr, fp, dayElem) {
          if (dayElem.dateObj < today) {
            dayElem.classList.add('past');
          }
        },
      });
    }

    if (timeInput) {
      flatpickr(timeInput, {
        noCalendar: true,
        enableTime: true,
        dateFormat: 'h:i K',
        time_24hr: false,
        wrap: true,
        disableMobile: true,
      });
    }
  }

  formatTimeToHoursAndMinutes(time: number): string {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours} hours and ${minutes} minutes`;
  }

  formatTimeToAmPm(time: string): string {
    if (!time) {
      return '';
    }
    const parts = time.split(':');
    if (parts.length !== 2) {
      return '';
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) {
      return '';
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  updateExtraServiceValues() {
    const formValues = this.calculatorForm.value;
    this.organizingHours = formValues.organizing ? formValues.organizing : 0;
    this.insideWindowsNumbers = formValues.insideWindows
      ? formValues.insideWindows
      : 0;
    this.wallsNumbers = formValues.wallCleaning ? formValues.wallCleaning : 0;
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
      this.calculatePriceAndTime();
      this.showPaymentMethodSelection = true; // Show payment method selection modal
    }
  }

  selectPaymentMethod(method: string): void {
    this.showPaymentMethodSelection = false; // Hide the payment method selection modal
    if (method === 'paypal') {
      this.showPayPalForm = true;
    } else if (method === 'creditcard') {
      this.stripeService.loadStripeScript(); // Use the injected service here
      this.showCreditCardForm = true;
    }
  }

  closePaymentMethodSelection() {
    this.showPaymentMethodSelection = false;
  }

  openPaymentForm(): void {
    this.showPaymentForm = true;
  }

  closePaymentForm(): void {
    this.showPaymentForm = false;
    this.showPayPalForm = false;
    this.showCreditCardForm = false;
  }

  onPaymentSuccess(event: any): void {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const month = monthNames[tomorrow.getMonth()];
    const day = tomorrow.getDate();
    const year = tomorrow.getFullYear();
    const tomorrowDateString = `${month}-${day}-${year}`;

    this.sendEmail();
    this.calculatorForm.reset({
      serviceType: 'Residential',
      bedrooms: 'studio',
      bathrooms: 1,
      squareFeet: '<400',
      serviceDate: tomorrowDateString,
      serviceTime: '9:00' + ' ' + 'AM',
      frequency: 'One Time',
      discount: null,
      entryMethod: '',
      specialInstructions: '',
      sameDay: false,
      deepCleaning: false,
      insideOfClosets: false,
      insideTheOven: false,
      insideTheFridge: false,
      washingDishes: false,
      wallCleaning: null,
      insideWindows: null,
      petHairClean: false,
      insideCabinets: false,
      balcony: false,
      supplies: false,
      office: false,
      laundry: false,
      folding: false,
      organizing: null,
      // vacuum: false,
      vacuum2: false,
      cleaners: 1,
      hours: 3,
      name: null,
      lastName: null,
      email: null,
      cellNumber: null,
      address: null,
      apartment: null,
      city: '',
      state: 'NY',
      zipCode: null,
      tips: null,
    });
    // this.closePaymentForm();
  }

  sendEmail(): void {
    const formValues = this.calculatorForm.value;

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

    this.updateExtraServiceValues();

    const organizingHoursText = formValues.organizing
      ? `${this.organizingHours} hours`
      : '0 hours';
    const insideWindowsText = formValues.insideWindows
      ? `${this.insideWindowsNumbers} windows`
      : '0 windows';
    const wallsText = formValues.wallCleaning
      ? `${this.wallsNumbers} walls`
      : '0 walls';
    // const vacuumOptionText = formValues.vacuum
    //   ? this.selectedVacuumOption
    //   : 'NO';

    // Function to conditionally include information based on boolean value
    const conditionalInclude = (label: string, value: boolean) => {
      return value ? `${label}: ${booleanToYesNo(value)}` : null;
    };

    const extraServicesText = [
      conditionalInclude('      Same Day Service', formValues.sameDay),
      conditionalInclude('      Deep Cleaning', formValues.deepCleaning),
      conditionalInclude('      Inside of Closets', formValues.insideOfClosets),
      conditionalInclude('      Inside the Oven', formValues.insideTheOven),
      conditionalInclude('      Inside the Fridge', formValues.insideTheFridge),
      conditionalInclude('      Washing Dishes', formValues.washingDishes),
      conditionalInclude('      Pet Hair Clean', formValues.petHairClean),
      conditionalInclude(
        '      Inside Kitchen Cabinets',
        formValues.insideCabinets
      ),
      conditionalInclude('      Balcony Cleaning', formValues.balcony),
      conditionalInclude('      Use Cleaner Supplies', formValues.supplies),
      conditionalInclude('      Office', formValues.office),
      conditionalInclude('      Laundry', formValues.laundry),
      conditionalInclude('      Folding / Organizing', formValues.folding),
      conditionalInclude('      Bring Vacuum Cleaner', formValues.vacuum2),
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
      Square Feet: ${formValues.squareFeet ?? 'None'}
      Service Date: ${serviceDate}
      Service Time: ${formattedServiceTime}
      Frequency: ${formValues.frequency}
      Discount: ${formValues.discount ?? 'None'}
      Entry Method: ${entryMethodText}
      Special Instructions: ${formValues.specialInstructions || 'None'}
${extraServicesText}
      Inside Windows: ${insideWindowsText}
      Walls Quantity: ${wallsText}
      Hours of Organizing: ${organizingHoursText}
      Number of Cleaners: ${this.requiredCleaners}
      Number of Hours: ${
        this.isCustomCleaning ? customCleaningHoursText : 'N/A'
      }
      ${!this.isCustomCleaning ? `Sub-total Time: ${subTotalTimeText}\n` : ''}
      ${!this.isCustomCleaning ? `Total Time: ${totalTimeText}\n` : ''}
      Sub-total Price: $${this.totalPrice?.toFixed(2)}
      Sales Tax: $${this.salesTax?.toFixed(2)}
      Tips: $${this.tips?.toFixed(2)}
      Total Price: $${this.total?.toFixed(2)}
  
      Contact Info:
  
      Name: ${formValues.name}
      Last Name: ${formValues.lastName}
      Email: ${formValues.email}
      Cell Number: +1 ${formValues.cellNumber || 'None'}
  
      Address Info:
  
      Address: ${formValues.address}
      Apartment: ${formValues.apartment || 'N/A'}
      City: ${cityText}
      State: ${stateText}
      Zip Code: ${formValues.zipCode}
    `;

    const clientEmailText = `
      Thank you for booking our service!
  
      Here are your booking details:
  
      Service Type: ${formValues.serviceType}
      Bedrooms: ${formValues.bedrooms ?? 'None'}
      Bathrooms: ${formValues.bathrooms ?? 'None'}
      Square Feet: ${formValues.squareFeet ?? 'None'}
      Service Date: ${serviceDate}
      Service Time: ${formattedServiceTime}
      Frequency: ${formValues.frequency}
      Discount: ${formValues.discount ?? 'None'}
      Entry Method: ${entryMethodText}
      Special Instructions For Cleaners: ${
        formValues.specialInstructions || 'None'
      }
${extraServicesText}
      Inside Windows: ${insideWindowsText}
      Walls Quantity: ${wallsText}
      Hours of Organizing: ${organizingHoursText}
      Number of Cleaners: ${this.requiredCleaners}
      Number of Hours: ${
        this.isCustomCleaning ? customCleaningHoursText : 'N/A'
      }
      ${!this.isCustomCleaning ? `Sub-total Time: ${subTotalTimeText}\n` : ''}
      ${!this.isCustomCleaning ? `Total Time: ${totalTimeText}\n` : ''}
      Sub-total Price: $${this.totalPrice?.toFixed(2)}
      Sales Tax: $${this.salesTax?.toFixed(2)}
      Tips: $${this.tips?.toFixed(2)}
      Total Price: $${this.total?.toFixed(2)}
  
      Address Info:
  
      Your Address: ${formValues.address}
      Your Apartment: ${formValues.apartment || 'N/A'}
      Your City: ${cityText}
      Your State: ${stateText}
      Your Zip Code: ${formValues.zipCode}
    `;

    const yourEmailPayload = {
      email: 'DreamCleaningInfos@gmail.com', // Your email address
      subject: 'New Booking',
      text: emailText,
    };

    const clientEmailPayload = {
      email: formValues.email, // Client's email address
      subject: 'Booking Confirmation',
      text: clientEmailText,
      from: 'DreamCleaningInfos@gmail.com', // Ensure this field is added
    };

    // Send email to you
    this.http.post(`${environment.api}/send-email`, yourEmailPayload).subscribe(
      (response) => {
        console.log('Email sent to you successfully', response);
      },
      (error) => {
        console.error('Error sending email to you', error);
      }
    );

    // Send email to the client
    this.http
      .post(`${environment.api}/send-email`, clientEmailPayload)
      .subscribe(
        (response) => {
          console.log('Email sent to client successfully', response);
        },
        (error) => {
          console.error('Error sending email to client', error);
        }
      );
  }

  calculatePriceAndTime(): void {
    const formValues = this.calculatorForm.value;
    let basePrice = 0;
    let subTotalTime = 0;

    const squareFeetKey = `${formValues.bedrooms}_${formValues.squareFeet}`;
    const squareFeetPrice = this.squareFeetPriceValues[squareFeetKey] || 0;
    const squareFeetTime = this.squareFeetTimeValues[squareFeetKey] || 0;
    basePrice += squareFeetPrice;
    subTotalTime += squareFeetTime;

    switch (formValues.serviceType) {
      case 'Residential':
        basePrice += 0;
        subTotalTime += 1;
        break;
      case 'Move In':
        basePrice += 90;
        subTotalTime += 4;
        break;
      case 'Move Out':
        basePrice += 90;
        subTotalTime += 4;
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
          bedroomBasePrice = formValues.deepCleaning ? 85 : 55;
          bedroomTime = formValues.deepCleaning ? 1.5 : 0.5;
          break;
        case 'one':
          bedroomBasePrice = formValues.deepCleaning ? 95 : 65;
          bedroomTime = formValues.deepCleaning ? 2.5 : 1;
          break;
        case 'two':
          bedroomBasePrice = formValues.deepCleaning ? 115 : 85;
          bedroomTime = formValues.deepCleaning ? 3 : 1.5;
          break;
        case 'three':
          bedroomBasePrice = formValues.deepCleaning ? 135 : 105;
          bedroomTime = formValues.deepCleaning ? 3 : 2;
          break;
        case 'four':
          bedroomBasePrice = formValues.deepCleaning ? 155 : 125;
          bedroomTime = formValues.deepCleaning ? 3.5 : 2.5;
          break;
        case 'five':
          bedroomBasePrice = formValues.deepCleaning ? 175 : 145;
          bedroomTime = formValues.deepCleaning ? 4 : 3;
          break;
        case 'six':
          bedroomBasePrice = formValues.deepCleaning ? 195 : 165;
          bedroomTime = formValues.deepCleaning ? 4.5 : 3.5;
          break;
      }

      basePrice += bedroomBasePrice;
      subTotalTime += bedroomTime;

      const bathrooms = formValues.bathrooms;
      if (bathrooms > 1) {
        const extraBathrooms = bathrooms - 1;
        basePrice += extraBathrooms * 25;
        subTotalTime += extraBathrooms * 0.5;
      }
    }

    Object.keys(formValues).forEach((service) => {
      if (
        formValues[service] &&
        this.extraServicePrices[service] !== undefined
      ) {
        if (service === 'organizing') {
          basePrice += 55 * formValues[service];
          subTotalTime += 1 * formValues[service];
        } else if (service === 'insideWindows') {
          basePrice += 30 * formValues[service];
          subTotalTime += 0.5 * formValues[service];
        } else if (service === 'wallCleaning') {
          basePrice += 25 * formValues[service];
          subTotalTime += 0.5 * formValues[service];
        } else {
          basePrice += this.extraServicePrices[service];
          subTotalTime += this.extraServiceTimes[service];
        }
      }
    });

    const frequencyDiscount =
      this.frequencies.find((freq) => freq.value === formValues.frequency)
        ?.discount || 0;
    const freqDiscountAmount = (basePrice * frequencyDiscount) / 100;
    basePrice -= freqDiscountAmount;

    const discount =
      this.discounts.find((disc) => disc.value === formValues.discount)
        ?.discount || 0;
    const discountAmount = (basePrice * discount) / 100;
    basePrice -= discountAmount;

    const salesTax = basePrice * 0.0888;

    // Sanitize the tips value
    this.tips = formValues.tips ? parseFloat(formValues.tips) : 0;

    // Calculate total without including tips in the sales tax calculation
    const total = basePrice + salesTax + this.tips;

    this.totalPrice = basePrice;
    this.subTotalTime = subTotalTime;

    if (formValues.serviceType !== 'Custom Cleaning') {
      this.requiredCleaners = Math.ceil(subTotalTime / 7);
      this.totalTime = subTotalTime / this.requiredCleaners;
    } else {
      this.requiredCleaners = formValues.cleaners;
      this.totalTime = subTotalTime;
    }

    this.salesTax = salesTax;
    this.total = total;
  }
}
