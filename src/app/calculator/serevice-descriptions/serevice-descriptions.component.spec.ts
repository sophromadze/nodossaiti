import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SereviceDescriptionsComponent } from './serevice-descriptions.component';

describe('SereviceDescriptionsComponent', () => {
  let component: SereviceDescriptionsComponent;
  let fixture: ComponentFixture<SereviceDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SereviceDescriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SereviceDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
