import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SaveGraphDialog } from 'src/app/dialogs/save-graph/save-graph.dialog';
import { MaterialModule } from 'src/app/material.module';

describe('SaveGraphDialog', () => {
  let component: SaveGraphDialog;
  let fixture: ComponentFixture<SaveGraphDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveGraphDialog],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
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
