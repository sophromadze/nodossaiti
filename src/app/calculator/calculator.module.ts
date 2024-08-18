import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { ServiceDescriptionComponent } from './service-description/service-description.component';
import { ExtraServicesComponent } from './extra-services/extra-services.component';
import { TooltipComponent } from './extra-services/tooltip/tooltip.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaypalButtonComponent } from './paypal-button/paypal-button.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: CalculatorComponent }];

@NgModule({
  declarations: [
    CalculatorComponent,
    ServiceDescriptionComponent,
    ExtraServicesComponent,
    TooltipComponent,
    PaymentFormComponent,
    PaypalButtonComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CalculatorModule {}
