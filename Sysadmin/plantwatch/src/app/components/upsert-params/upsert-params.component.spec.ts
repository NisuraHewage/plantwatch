import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertParamsComponent } from './upsert-params.component';

describe('UpsertParamsComponent', () => {
  let component: UpsertParamsComponent;
  let fixture: ComponentFixture<UpsertParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
