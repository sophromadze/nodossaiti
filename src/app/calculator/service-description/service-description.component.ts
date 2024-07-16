import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-description',
  templateUrl: './service-description.component.html',
  styleUrls: ['./service-description.component.scss'],
})
export class ServiceDescriptionComponent {
  @Input() serviceType: string | null = null;
  @Input() isDeepCleaningSelected: boolean = false;
}
