import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterCrtezComponent } from './dekorater-crtez.component';

describe('DekoraterCrtezComponent', () => {
  let component: DekoraterCrtezComponent;
  let fixture: ComponentFixture<DekoraterCrtezComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterCrtezComponent]
    });
    fixture = TestBed.createComponent(DekoraterCrtezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
