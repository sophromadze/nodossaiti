import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesPageComponent } from './services-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ServicesPageComponent }];

@NgModule({
  declarations: [ServicesPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ServicesPageModule {}
