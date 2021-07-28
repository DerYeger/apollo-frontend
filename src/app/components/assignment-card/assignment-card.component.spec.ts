import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AssignmentCardComponent } from 'src/app/components/assignment-card/assignment-card.component';
import { MaterialModule } from 'src/app/material.module';
import { Assignment } from 'src/app/model/api/assignment';

const testAssignment: Assignment = {
  id: 'test',
  title: 'Test',
  formula: 'tt',
};

describe('AssignmentCardComponent', () => {
  let component: AssignmentCardComponent;
  let fixture: ComponentFixture<AssignmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentCardComponent],
      imports: [MaterialModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentCardComponent);
    component = fixture.componentInstance;
    component.assignment = testAssignment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
