import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
