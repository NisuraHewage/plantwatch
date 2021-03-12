import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKnowledgebaseComponent } from './add-knowledgebase.component';

describe('AddKnowledgebaseComponent', () => {
  let component: AddKnowledgebaseComponent;
  let fixture: ComponentFixture<AddKnowledgebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKnowledgebaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKnowledgebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
