import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceDescriptionComponent } from './calculator/service-description/service-description.component';
import { ExtraServicesComponent } from './calculator/extra-services/extra-services.component';
import { TooltipComponent } from './calculator/extra-services/tooltip/tooltip.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentFormComponent } from './calculator/payment-form/payment-form.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { SliderComponent } from './main/slider/slider.component';
import { CitiesComponent } from './main/cities/cities.component';
import { ContactComponent } from './contact/contact.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    CalculatorComponent,
    ServiceDescriptionComponent,
    ExtraServicesComponent,
    TooltipComponent,
    PaymentFormComponent,
    AboutComponent,
    FooterComponent,
    SliderComponent,
    CitiesComponent,
    ContactComponent,
    ScrollToTopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
