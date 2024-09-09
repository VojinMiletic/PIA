import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorPrijavaComponent } from './administrator-prijava.component';

describe('AdministratorPrijavaComponent', () => {
  let component: AdministratorPrijavaComponent;
  let fixture: ComponentFixture<AdministratorPrijavaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorPrijavaComponent]
    });
    fixture = TestBed.createComponent(AdministratorPrijavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
