import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/send-email'; // Ensure this URL is correct

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    return this.http.post(this.apiUrl, emailData);
  }
}
