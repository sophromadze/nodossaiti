import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.scss'],
})
export class AddressInformationComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  addressInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressInfoForm = this.fb.group({
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      state: ['NY', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.parentForm.addControl('addressInfo', this.addressInfoForm);
  }
}
