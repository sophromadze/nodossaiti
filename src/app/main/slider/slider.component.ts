import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  activeSlideId: string = '1';
  autoSlidingActive: boolean = false;
  autoSlidingTO: any;
  slidingAT: number = 0;
  slidingDelay: number = 0;
  setAutoslidingTO!: () => void;
  isCreditsActive: boolean = true;
  isCreditsContainerActive: boolean = false;

  private demoCont: HTMLElement | null = null;
  private fncSliderElement: HTMLElement | null = null;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.preloadSliderImages();
  }

  ngAfterViewInit(): void {
    this.demoCont = this.el.nativeElement.querySelector('.demo-cont');
    this.fncSliderElement = this.el.nativeElement.querySelector('.fnc-slider');
    this.initializeSlider();
  }

  preloadSliderImages(): void {
    const screenWidth = window.innerWidth;
    let imagesToPreload: string[] = [];

    if (screenWidth <= 1280) {
      // Preload medium images
      imagesToPreload = [
        '/assets/images/regular2-medium.webp',
        '/assets/images/deep2-medium.webp',
        '/assets/images/moveIn2-medium.webp',
        '/assets/images/moveOut-medium.webp',
        '/assets/images/renovation-medium.webp',
      ];
    } else {
      // Preload large images
      imagesToPreload = [
        '/assets/images/regular2-large.webp',
        '/assets/images/deep2-large.webp',
        '/assets/images/moveIn2-large.webp',
        '/assets/images/moveOut-large.webp',
        '/assets/images/renovation-large.webp',
      ];
    }

    imagesToPreload.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  initializeSlider(): void {
    const selectElements = (selector: string, context?: any): HTMLElement[] => {
      context = context || document;
      const elements = context.querySelectorAll(selector);
      return Array.from(elements) as HTMLElement[];
    };

    const _fncSliderInit = (slider: HTMLElement, options: any) => {
      const prefix = '.fnc-';
      const slidesCont = slider.querySelector(
        prefix + 'slider__slides'
      ) as HTMLElement;
      const slides = selectElements(`${prefix}slide`, slider);
      const controls = selectElements(`${prefix}nav__control`, slider);
      const controlsBgs = selectElements(`${prefix}nav__bg`, slider);
      const progressAS = selectElements(
        `${prefix}nav__control-progress`,
        slider
      );

      const numOfSlides = slides.length;
      let curSlide = 1;
      let sliding = false;
      this.slidingAT =
        +parseFloat(
          getComputedStyle(slidesCont).getPropertyValue('transition-duration')
        ) * 1000;
      this.slidingDelay =
        +parseFloat(
          getComputedStyle(slidesCont).getPropertyValue('transition-delay')
        ) * 1000;

      const autoSlidingDelay = 5000;
      let autoSlidingBlocked = false;

      let activeSlide: HTMLElement;
      let activeControlsBg: HTMLElement;
      let prevControl: HTMLElement;

      const setIDs = () => {
        slides.forEach((slide, index) => {
          slide.classList.add('fnc-slide-' + (index + 1));
        });

        controls.forEach((control, index) => {
          control.setAttribute('data-slide', (index + 1).toString());
          control.classList.add('fnc-nav__control-' + (index + 1));
        });

        controlsBgs.forEach((bg, index) => {
          bg.classList.add('fnc-nav__bg-' + (index + 1));
        });
      };

      setIDs();

      const afterSlidingHandler = () => {
        const previousSlide = slider.querySelector('.m--previous-slide');
        if (previousSlide)
          previousSlide.classList.remove(
            'm--active-slide',
            'm--previous-slide'
          );

        const previousNavBg = slider.querySelector('.m--previous-nav-bg');
        if (previousNavBg)
          previousNavBg.classList.remove(
            'm--active-nav-bg',
            'm--previous-nav-bg'
          );

        activeSlide.classList.remove('m--before-sliding');
        activeControlsBg.classList.remove('m--nav-bg-before');
        prevControl.classList.remove('m--prev-control');
        prevControl.classList.add('m--reset-progress');
        prevControl.classList.remove('m--reset-progress');

        sliding = false;

        if (this.autoSlidingActive && !autoSlidingBlocked) {
          this.setAutoslidingTO();
        }

        this.updateCreditsContent();
      };

      // const performSliding = (slideID: number) => {
      //   if (sliding) return;
      //   sliding = true;
      //   window.clearTimeout(this.autoSlidingTO);
      //   curSlide = slideID;

      //   prevControl = slider.querySelector('.m--active-control') as HTMLElement;
      //   prevControl.classList.remove('m--active-control');
      //   prevControl.classList.add('m--prev-control');
      //   (
      //     slider.querySelector(
      //       prefix + 'nav__control-' + slideID
      //     ) as HTMLElement
      //   ).classList.add('m--active-control');

      //   activeSlide = slider.querySelector(
      //     prefix + 'slide-' + slideID
      //   ) as HTMLElement;
      //   activeControlsBg = slider.querySelector(
      //     prefix + 'nav__bg-' + slideID
      //   ) as HTMLElement;

      //   const currentActiveSlide = slider.querySelector('.m--active-slide');
      //   if (currentActiveSlide)
      //     currentActiveSlide.classList.add('m--previous-slide');

      //   const currentActiveNavBg = slider.querySelector('.m--active-nav-bg');
      //   if (currentActiveNavBg)
      //     currentActiveNavBg.classList.add('m--previous-nav-bg');

      //   activeSlide.classList.add('m--before-sliding');
      //   activeControlsBg.classList.add('m--nav-bg-before');

      //   const layoutTrigger = activeSlide.offsetTop;

      //   activeSlide.classList.add('m--active-slide');
      //   activeControlsBg.classList.add('m--active-nav-bg');

      //   setTimeout(afterSlidingHandler, this.slidingAT + this.slidingDelay);
      // };

      const performSliding = (slideID: number) => {
        if (sliding) return;
        sliding = true;
        window.clearTimeout(this.autoSlidingTO);
        curSlide = slideID;

        prevControl = slider.querySelector('.m--active-control') as HTMLElement;
        prevControl.classList.remove('m--active-control');
        prevControl.classList.add('m--prev-control');
        (
          slider.querySelector(
            prefix + 'nav__control-' + slideID
          ) as HTMLElement
        ).classList.add('m--active-control');

        activeSlide = slider.querySelector(
          prefix + 'slide-' + slideID
        ) as HTMLElement;
        activeControlsBg = slider.querySelector(
          prefix + 'nav__bg-' + slideID
        ) as HTMLElement;

        const currentActiveSlide = slider.querySelector('.m--active-slide');
        if (currentActiveSlide)
          currentActiveSlide.classList.add('m--previous-slide');

        const currentActiveNavBg = slider.querySelector('.m--active-nav-bg');
        if (currentActiveNavBg)
          currentActiveNavBg.classList.add('m--previous-nav-bg');

        activeSlide.classList.add('m--before-sliding');
        activeControlsBg.classList.add('m--nav-bg-before');

        // This triggers a layout reflow, necessary for transitions
        activeSlide.offsetTop;

        activeSlide.classList.add('m--active-slide');
        activeControlsBg.classList.add('m--active-nav-bg');

        // No need to manually manage transitions; SCSS handles it now
        setTimeout(afterSlidingHandler, this.slidingAT + this.slidingDelay);
      };

      const controlClickHandler = function (this: HTMLElement) {
        if (sliding) return;
        if (this.classList.contains('m--active-control')) return;
        if (options.blockASafterClick) {
          autoSlidingBlocked = true;
          slider.classList.add('m--autosliding-blocked');
        }

        const slideID = +this.getAttribute('data-slide')!;

        performSliding(slideID);
      };

      controls.forEach((control) => {
        control.addEventListener('click', controlClickHandler);
      });

      this.setAutoslidingTO = () => {
        window.clearTimeout(this.autoSlidingTO);
        const delay = +options.autoSlidingDelay || autoSlidingDelay;
        curSlide++;
        if (curSlide > numOfSlides) curSlide = 1;

        this.autoSlidingTO = setTimeout(() => {
          performSliding(curSlide);
        }, delay);
      };

      if (options.autoSliding || +options.autoSlidingDelay > 0) {
        if (options.autoSliding === false) return;

        this.autoSlidingActive = true;
        this.setAutoslidingTO();

        slider.classList.add('m--with-autosliding');
        const triggerLayout = slider.offsetTop;

        let delay = +options.autoSlidingDelay || autoSlidingDelay;
        delay += this.slidingDelay + this.slidingAT;

        progressAS.forEach((progress) => {
          (progress as HTMLElement).style.transition =
            'transform ' + delay / 1000 + 's';
        });
      }

      (
        slider.querySelector('.fnc-nav__control:first-child') as HTMLElement
      ).classList.add('m--active-control');

      this.updateCreditsContent();

      const globalBlending = document.querySelector(
        '.js-activate-global-blending'
      );
      if (globalBlending) {
        globalBlending.addEventListener('click', () => {
          const exampleSlider = document.querySelector('.example-slider');
          if (exampleSlider)
            exampleSlider.classList.toggle('m--global-blending-active');
        });
      }
    };

    const fncSlider = (sliderSelector: string, options: any) => {
      const sliders = selectElements(sliderSelector);

      sliders.forEach((slider) => {
        _fncSliderInit.call(this, slider, options);
      });
    };

    fncSlider.call(this, '.example-slider', { autoSlidingDelay: 6000 });
  }

  updateCreditsContent(): void {
    const activeSlide = document.querySelector('.m--active-slide');
    const newSlideId = activeSlide?.getAttribute('data-slide-id') || '1';

    if (this.activeSlideId !== newSlideId) {
      this.isCreditsActive = false;
      this.cdr.detectChanges(); // Manually trigger change detection
      setTimeout(() => {
        this.activeSlideId = newSlideId;
        this.isCreditsActive = true;
        this.cdr.detectChanges(); // Manually trigger change detection
      }, 50); // Match the duration of your CSS transition
    }
  }

  controlClickHandler(slideID: number): void {
    if (this.activeSlideId !== slideID.toString()) {
      const currentCredits = this.el.nativeElement.querySelector(
        `.demo-cont__credits-${this.activeSlideId}`
      );
      const newCredits = this.el.nativeElement.querySelector(
        `.demo-cont__credits-${slideID}`
      );

      if (currentCredits) {
        this.renderer.removeClass(currentCredits, 'credits-spin-in');
        this.renderer.addClass(currentCredits, 'credits-spin-out');
      }

      this.isCreditsActive = false;
      this.cdr.detectChanges(); // Manually trigger change detection
      setTimeout(() => {
        if (newCredits) {
          this.renderer.removeClass(newCredits, 'credits-spin-out');
          this.renderer.addClass(newCredits, 'credits-spin-in');
        }
        this.activeSlideId = slideID.toString();
        this.isCreditsActive = true;
        this.cdr.detectChanges(); // Manually trigger change detection
      }, 500); // Match the duration of your CSS transition
    }
  }

  navigateToCalculator(type: string) {
    this.router.navigate(['/calculator'], {
      queryParams: { type },
    });
  }

  onReadMoreButtonClick() {
    const creditsContainer = this.demoCont!.querySelector(
      '.demo-cont__credits-container'
    );

    if (this.demoCont && this.fncSliderElement && creditsContainer) {
      this.demoCont.classList.toggle('credits-active');
      creditsContainer?.classList.toggle('credits-container-active');
      this.autoSlidingActive = !this.autoSlidingActive;

      if (this.autoSlidingActive) {
        this.setAutoslidingTO();
        this.fncSliderElement.classList.remove('m--autosliding-blocked');
      } else {
        window.clearTimeout(this.autoSlidingTO);
        this.fncSliderElement.classList.add('m--autosliding-blocked');
      }
    }
  }

  onCloseButtonClick() {
    const creditsContainer = this.demoCont!.querySelector(
      '.demo-cont__credits-container'
    );
    if (this.demoCont && this.fncSliderElement) {
      this.demoCont.classList.remove('credits-active');
      creditsContainer?.classList.remove('credits-container-active');
      if (!this.autoSlidingActive) {
        this.autoSlidingActive = true;
        this.setAutoslidingTO();
        this.fncSliderElement.classList.remove('m--autosliding-blocked');
      }
    }
  }
}
