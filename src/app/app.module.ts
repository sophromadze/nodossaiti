import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SereviceDescriptionsComponent } from './calculator/serevice-descriptions/serevice-descriptions.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    CalculatorComponent,
    SereviceDescriptionsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
