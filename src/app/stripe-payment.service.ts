import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripePaymentService {
  private stripePromise: Promise<Stripe | null> | null = null;

  constructor() {}

  loadStripeScript(): void {
    if (!document.querySelector('#stripe-js')) {
      const script = document.createElement('script');
      script.id = 'stripe-js';
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        this.stripePromise = loadStripe(
          'pk_live_51PYF6Z05IY2xZyNcvMKAtKn18jBqk61fq1TyWa7lZfZUnaCEftF2vNtZMBDhQKM1IiRmbhvLnrrCFhBS7NzgMWj000Hz7P7Mv2'
        ); // Replace with your Stripe publishable key
      };
      document.body.appendChild(script);
    }
  }

  async getStripe(): Promise<Stripe | null> {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(
        'pk_live_51PYF6Z05IY2xZyNcvMKAtKn18jBqk61fq1TyWa7lZfZUnaCEftF2vNtZMBDhQKM1IiRmbhvLnrrCFhBS7NzgMWj000Hz7P7Mv2'
      );
    }
    return this.stripePromise;
  }
}
