import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmenaComponent } from './izmena.component';

describe('IzmenaComponent', () => {
  let component: IzmenaComponent;
  let fixture: ComponentFixture<IzmenaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IzmenaComponent]
    });
    fixture = TestBed.createComponent(IzmenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
