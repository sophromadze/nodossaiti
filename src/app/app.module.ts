import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceDescriptionComponent } from './calculator/service-description/service-description.component';
import { ContactInformationComponent } from './calculator/contact-information/contact-information.component';
import { AddressInformationComponent } from './calculator/address-information/address-information.component';
import { ExtraServicesComponent } from './calculator/extra-services/extra-services.component';
import { TooltipComponent } from './calculator/extra-services/tooltip/tooltip.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentFormComponent } from './calculator/payment-form/payment-form.component';
import { AboutComponent } from './about/about.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardDetailsModalComponent } from './main/card-details/card-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    CalculatorComponent,
    ServiceDescriptionComponent,
    ContactInformationComponent,
    AddressInformationComponent,
    ExtraServicesComponent,
    TooltipComponent,
    PaymentFormComponent,
    AboutComponent,
    CardDetailsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
