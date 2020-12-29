import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';

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
            formula: '',
            description: {
              key: '',
            },
            isModel: false,
            children: [],
          },
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
