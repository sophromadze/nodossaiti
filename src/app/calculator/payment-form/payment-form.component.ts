import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { StripePaymentService } from '../../stripe-payment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit {
  @Input() amount!: number;
  @Input() formValues: any;
  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();
  stripe: Stripe | null = null;
  elements!: StripeElements;
  card!: StripeCardElement;
  paymentForm: FormGroup;

  showConfirmModal = false;
  showResultModal = false;
  paymentSuccessFlag = false;
  isLoading = false;

  private paymentIntentId: string | null = null; // Store payment intent ID

  constructor(
    private stripeService: StripePaymentService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.stripe = await this.stripeService.getStripe();
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }

  showConfirmation() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.showConfirmModal = true;
  }

  cancelConfirmation() {
    this.showConfirmModal = false;
  }

  async confirmPayment() {
    this.showConfirmModal = false;
    this.isLoading = true; // Show loading spinner

    const name = this.paymentForm.get('name')?.value;
    if (this.stripe && this.card) {
      // Create a payment intent on the server and retrieve the client secret
      const amountInCents = Math.round(this.amount * 100);
      this.http
        .post(`${environment.api}/create-payment-intent`, {
          amount: amountInCents,
        })
        .subscribe(
          async (response: any) => {
            const clientSecret = response.clientSecret;
            this.paymentIntentId = response.paymentIntentId; // Store the payment intent ID
            const { error, paymentIntent } =
              await this.stripe!.confirmCardPayment(clientSecret, {
                payment_method: {
                  card: this.card,
                  billing_details: {
                    name,
                  },
                },
                setup_future_usage: 'off_session', // Allow capture later
              });

            if (error) {
              console.error('Error confirming card payment:', error);
              this.paymentSuccessFlag = false;
              this.showResultModal = true;
            } else if (
              paymentIntent &&
              paymentIntent.status === 'requires_capture'
            ) {
              console.log('Payment authorized but not captured', paymentIntent);
              this.paymentSuccessFlag = true;
              this.showResultModal = true;
              this.paymentSuccess.emit(this.formValues);
            }
            this.isLoading = false; // Hide loading spinner
          },
          (error) => {
            console.error('Error creating payment intent:', error);
            this.paymentSuccessFlag = false;
            this.showResultModal = true;
            this.isLoading = false; // Hide loading spinner
          }
        );
    }
  }

  closeResultModal() {
    this.showResultModal = false;
    this.close.emit();
  }

  closeForm() {
    this.close.emit();
  }
}
