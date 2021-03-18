import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { ResultTreeDialog } from 'src/app/components/dialogs/result-tree/result-tree.dialog';
import { TraceComponent } from 'src/app/components/dialogs/result-tree/trace/trace.component';
import { MaterialModule } from 'src/app/material.module';
import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';
import { reducers } from 'src/app/store/reducers';

describe('ResultTreeDialog', () => {
  let component: ResultTreeDialog;
  let fixture: ComponentFixture<ResultTreeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultTreeDialog, TraceComponent],
      imports: [MaterialModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), LoggerTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            feedback: 'full',
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
