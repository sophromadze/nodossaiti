import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  showPopup = false;
  showErrorPopup = false; // Add this line

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
      receiveMessages: [false], // Default value for checkbox
    });
  }

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

  onSubmit() {
    if (this.contactForm.valid) {
      this.onSentMail(this.contactForm.value);
    }
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
        this.showErrorPopup = false; // Reset error popup
      },
      (error) => {
        console.error('Error sending email to you', error);
        this.showErrorPopup = true; // Show error popup
        this.showPopup = false; // Reset success popup
      }
    );
  }

  closePopup() {
    this.showPopup = false;
    this.showErrorPopup = false; // Add this line
  }
}
