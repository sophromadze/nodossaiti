import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PayPalPaymentService } from '../../services/paypal-payment.service';

declare var paypal: any; // Declare the PayPal variable

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.scss'],
})
export class PaypalButtonComponent implements OnInit {
  @Input() amount!: number;
  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();

  showResultModal = false;
  paymentSuccessFlag = false;
  isLoading = false;

  constructor(private payPalService: PayPalPaymentService) {}

  ngOnInit(): void {
    this.loadPayPalScript()
      .then(() => {
        paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: this.amount.toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                this.payPalService.captureOrder(details.id).subscribe(
                  (response) => {
                    this.paymentSuccessFlag = true;
                    this.showResultModal = true;
                    this.paymentSuccess.emit(details);
                  },
                  (error) => {
                    console.error('Payment capture failed:', error);
                    this.paymentSuccessFlag = false;
                    this.showResultModal = true;
                  }
                );
              });
            },
            onError: (err: any) => {
              console.error(err);
              this.paymentSuccessFlag = false;
              this.showResultModal = true;
            },
          })
          .render('#paypal-button-container');
      })
      .catch((err) => {
        console.error('PayPal SDK failed to load:', err);
      });
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-script';
      script.src =
        'https://www.paypal.com/sdk/js?client-id=AbWW1STI4d5wftUooZFqtZx6OlAQjyuboCwHw0dgqTnfluNucKQxK-eazKq61eoCaBhaMBzdEBfmjQXY';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('PayPal SDK could not be loaded.'));
      document.body.appendChild(script);
    });
  }

  closeResultModal() {
    this.showResultModal = false;
    this.close.emit();
  }

  closeForm() {
    this.close.emit();
  }
}
