import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { ExportGraphBottomSheet } from 'src/app/bottom-sheets/export-graph/export-graph.bottom-sheet';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

describe('ExportGraphBottomSheet', () => {
  let component: ExportGraphBottomSheet;
  let fixture: ComponentFixture<ExportGraphBottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportGraphBottomSheet],
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
      providers: [
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportGraphBottomSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
