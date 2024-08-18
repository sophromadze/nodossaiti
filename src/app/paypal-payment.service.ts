import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PayPalPaymentService {
  constructor(private http: HttpClient) {}

  captureOrder(orderId: string): Observable<any> {
    return this.http.post(`${environment.api}/paypal-webhook`, {
      orderID: orderId,
    });
  }
}
