import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SaveGraphDialog } from 'src/app/dialogs/save-graph/save-graph.dialog';
import { MaterialModule } from 'src/app/material.module';

describe('SaveGraphDialog', () => {
  let component: SaveGraphDialog;
  let fixture: ComponentFixture<SaveGraphDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveGraphDialog],
      imports: [FormsModule, MaterialModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveGraphDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
