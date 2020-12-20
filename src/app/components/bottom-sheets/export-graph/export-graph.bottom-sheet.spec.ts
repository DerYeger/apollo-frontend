import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

import { ExportGraphBottomSheet } from './export-graph.bottom-sheet';

describe('ExportGraphBottomSheet', () => {
  let component: ExportGraphBottomSheet;
  let fixture: ComponentFixture<ExportGraphBottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportGraphBottomSheet],
      imports: [MaterialModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), LoggerTestingModule],
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
