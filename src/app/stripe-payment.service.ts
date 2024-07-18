// src/app/stripe-payment.service.ts

import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripePaymentService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(
      'pk_live_51PYF6Z05IY2xZyNcvMKAtKn18jBqk61fq1TyWa7lZfZUnaCEftF2vNtZMBDhQKM1IiRmbhvLnrrCFhBS7NzgMWj000Hz7P7Mv2'
    ); // Replace with your Stripe publishable key
  }

  async getStripe() {
    return this.stripePromise;
  }
}
