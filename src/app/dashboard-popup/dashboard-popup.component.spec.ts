import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPopupComponent } from './dashboard-popup.component';

describe('DashboardPopupComponent', () => {
  let component: DashboardPopupComponent;
  let fixture: ComponentFixture<DashboardPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
