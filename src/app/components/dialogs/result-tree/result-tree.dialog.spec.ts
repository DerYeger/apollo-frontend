import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

import { ResultTreeDialog } from './result-tree.dialog';
import { TraceComponent } from './trace/trace.component';

describe('ResultTreeDialog', () => {
  let component: ResultTreeDialog;
  let fixture: ComponentFixture<ResultTreeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultTreeDialog, TraceComponent],
      imports: [MaterialModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            isMinimized: false,
            rootTrace: {
              formula: '',
              description: {
                key: '',
              },
              isModel: false,
              children: [] as ModelCheckerTrace[],
            } as ModelCheckerTrace,
          } as ModelCheckerResponse,
        },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTreeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
