import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
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

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.$demoCont = this.el.nativeElement.querySelector('.demo-cont');
    this.$fncSlider = this.el.nativeElement.querySelector('.fnc-slider');
    this.initializeSlider();
  }

  initializeSlider(): void {
    const $$ = (selector: string, context?: any): HTMLElement[] => {
      context = context || document;
      const elements = context.querySelectorAll(selector);
      return [].slice.call(elements);
    };

    const _fncSliderInit = ($slider: HTMLElement, options: any) => {
      const prefix = '.fnc-';
      const $slidesCont = $slider.querySelector(
        prefix + 'slider__slides'
      ) as HTMLElement;
      const $slides = $$(`${prefix}slide`, $slider);
      const $controls = $$(`${prefix}nav__control`, $slider);
      const $controlsBgs = $$(`${prefix}nav__bg`, $slider);
      const $progressAS = $$(`${prefix}nav__control-progress`, $slider);

      const numOfSlides = $slides.length;
      let curSlide = 1;
      let sliding = false;
      this.slidingAT =
        +parseFloat(
          getComputedStyle($slidesCont).getPropertyValue('transition-duration')
        ) * 1000;
      this.slidingDelay =
        +parseFloat(
          getComputedStyle($slidesCont).getPropertyValue('transition-delay')
        ) * 1000;

      const autoSlidingDelay = 5000;
      let autoSlidingBlocked = false;

      let $activeSlide: HTMLElement;
      let $activeControlsBg: HTMLElement;
      let $prevControl: HTMLElement;

      const setIDs = () => {
        $slides.forEach(($slide, index) => {
          $slide.classList.add('fnc-slide-' + (index + 1));
        });

        $controls.forEach(($control, index) => {
          $control.setAttribute('data-slide', (index + 1).toString());
          $control.classList.add('fnc-nav__control-' + (index + 1));
        });

        $controlsBgs.forEach(($bg, index) => {
          $bg.classList.add('fnc-nav__bg-' + (index + 1));
        });
      };

      setIDs();

      const afterSlidingHandler = () => {
        const previousSlide = $slider.querySelector('.m--previous-slide');
        if (previousSlide)
          previousSlide.classList.remove(
            'm--active-slide',
            'm--previous-slide'
          );

        const previousNavBg = $slider.querySelector('.m--previous-nav-bg');
        if (previousNavBg)
          previousNavBg.classList.remove(
            'm--active-nav-bg',
            'm--previous-nav-bg'
          );

        $activeSlide.classList.remove('m--before-sliding');
        $activeControlsBg.classList.remove('m--nav-bg-before');
        $prevControl.classList.remove('m--prev-control');
        $prevControl.classList.add('m--reset-progress');
        $prevControl.classList.remove('m--reset-progress');

        sliding = false;

        if (this.autoSlidingActive && !autoSlidingBlocked) {
          this.setAutoslidingTO();
        }

        this.updateCreditsContent();
      };

      const performSliding = (slideID: number) => {
        if (sliding) return;
        sliding = true;
        window.clearTimeout(this.autoSlidingTO);
        curSlide = slideID;

        $prevControl = $slider.querySelector(
          '.m--active-control'
        ) as HTMLElement;
        $prevControl.classList.remove('m--active-control');
        $prevControl.classList.add('m--prev-control');
        (
          $slider.querySelector(
            prefix + 'nav__control-' + slideID
          ) as HTMLElement
        ).classList.add('m--active-control');

        $activeSlide = $slider.querySelector(
          prefix + 'slide-' + slideID
        ) as HTMLElement;
        $activeControlsBg = $slider.querySelector(
          prefix + 'nav__bg-' + slideID
        ) as HTMLElement;

        const activeSlide = $slider.querySelector('.m--active-slide');
        if (activeSlide) activeSlide.classList.add('m--previous-slide');

        const activeNavBg = $slider.querySelector('.m--active-nav-bg');
        if (activeNavBg) activeNavBg.classList.add('m--previous-nav-bg');

        $activeSlide.classList.add('m--before-sliding');
        $activeControlsBg.classList.add('m--nav-bg-before');

        const layoutTrigger = $activeSlide.offsetTop;

        $activeSlide.classList.add('m--active-slide');
        $activeControlsBg.classList.add('m--active-nav-bg');

        setTimeout(afterSlidingHandler, this.slidingAT + this.slidingDelay);
      };

      const controlClickHandler = function (this: HTMLElement) {
        if (sliding) return;
        if (this.classList.contains('m--active-control')) return;
        if (options.blockASafterClick) {
          autoSlidingBlocked = true;
          $slider.classList.add('m--autosliding-blocked');
        }

        const slideID = +this.getAttribute('data-slide')!;

        performSliding(slideID);
      };

      $controls.forEach(($control) => {
        $control.addEventListener('click', controlClickHandler);
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

        $slider.classList.add('m--with-autosliding');
        const triggerLayout = $slider.offsetTop;

        let delay = +options.autoSlidingDelay || autoSlidingDelay;
        delay += this.slidingDelay + this.slidingAT;

        $progressAS.forEach(($progress) => {
          ($progress as HTMLElement).style.transition =
            'transform ' + delay / 1000 + 's';
        });
      }

      (
        $slider.querySelector('.fnc-nav__control:first-child') as HTMLElement
      ).classList.add('m--active-control');

      this.updateCreditsContent();

      const $demoCont = document.querySelector('.demo-cont');

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
      const $sliders = $$(sliderSelector);

      $sliders.forEach(($slider) => {
        _fncSliderInit.call(this, $slider, options);
      });
    };

    fncSlider.call(this, '.example-slider', { autoSlidingDelay: 4000 });
  }

  updateCreditsContent(): void {
    const activeSlide = document.querySelector('.m--active-slide');
    this.activeSlideId = activeSlide?.getAttribute('data-slide-id') || '1';

    const creditsContainer = this.el.nativeElement.querySelector(
      '.demo-cont__credits'
    ) as HTMLElement;

    const bookBtns = creditsContainer.querySelectorAll('.bookBtns');
    bookBtns.forEach((btn) => {
      this.renderer.listen(btn, 'click', () => {
        const type = activeSlide?.getAttribute('data-slide-id') || '1';
        this.navigateToCalculator(type);
      });
    });
  }

  navigateToCalculator(type: string): void {
    let mappedType: string;

    switch (type) {
      case '1':
        mappedType = 'regular';
        break;
      case '2':
        mappedType = 'deep';
        break;
      case '3':
        mappedType = 'moveIn';
        break;
      case '4':
        mappedType = 'moveOut';
        break;
      default:
        mappedType = 'regular';
    }

    this.router.navigate(['/calculator'], {
      queryParams: { type: mappedType },
    });
  }

  $demoCont = document.querySelector('.demo-cont');
  $fncSlider = document.querySelector('.fnc-slider');

  onReadMoreButtonClick() {
    if (this.$demoCont && this.$fncSlider) {
      this.$demoCont.classList.toggle('credits-active');
      this.autoSlidingActive = !this.autoSlidingActive;

      if (this.autoSlidingActive) {
        this.setAutoslidingTO();
        this.$fncSlider.classList.remove('m--autosliding-blocked');
      } else {
        window.clearTimeout(this.autoSlidingTO);
        this.$fncSlider.classList.add('m--autosliding-blocked');
      }
    }
  }

  onCloseButtonClick() {
    if (this.$demoCont && this.$fncSlider) {
      this.$demoCont.classList.remove('credits-active');
      if (!this.autoSlidingActive) {
        this.autoSlidingActive = true;
        this.setAutoslidingTO();
        this.$fncSlider.classList.remove('m--autosliding-blocked');
      }
    }
  }
}
