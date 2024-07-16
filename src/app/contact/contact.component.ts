// contact.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  showPopup = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const inputs = document.querySelectorAll('.input');

    function focusFunc(this: HTMLInputElement) {
      let parent = this.parentNode as HTMLElement;
      parent.classList.add('focus');
    }

    function blurFunc(this: HTMLInputElement) {
      let parent = this.parentNode as HTMLElement;
      if (this.value === '') {
        parent.classList.remove('focus');
      }
    }

    inputs.forEach((input) => {
      input.addEventListener('focus', focusFunc);
      input.addEventListener('blur', blurFunc);
    });
  }

  onSubmit(contactForm: NgForm) {
    const formData = contactForm.value;
    this.onSentMail(formData);
  }

  onSentMail(formData: any) {
    const emailText = `
      Full Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Message: ${formData.message}
    `;

    const yourEmailPayload = {
      from: formData.email, // Sender's email address
      email: 'DreamCleaningInfos@gmail.com', // Your email address
      subject: 'New Booking',
      text: emailText,
    };

    // Send email to you
    this.http.post(`${environment.api}/send-email`, yourEmailPayload).subscribe(
      (response) => {
        console.log('Email sent to you successfully', response);
        this.showPopup = true;
      },
      (error) => {
        console.error('Error sending email to you', error);
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }
}
