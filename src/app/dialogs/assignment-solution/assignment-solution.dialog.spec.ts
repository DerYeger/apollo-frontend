import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AssignmentSolutionDialog } from 'src/app/dialogs/assignment-solution/assignment-solution.dialog';
import { MaterialModule } from 'src/app/material.module';
import { AssignmentCheckResponse } from 'src/app/model/api/assignment-check-response';

describe('AssignmentSolutionDialog', () => {
  let component: AssignmentSolutionDialog;
  let fixture: ComponentFixture<AssignmentSolutionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentSolutionDialog],
      imports: [MaterialModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            correct: true,
            firstTrace: undefined,
            secondTrace: undefined,
          } as AssignmentCheckResponse,
        },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSolutionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
