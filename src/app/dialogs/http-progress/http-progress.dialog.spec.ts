import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { HttpProgressDialog } from 'src/app/dialogs/http-progress/http-progress.dialog';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

describe('HttpProgressDialog', () => {
  let component: HttpProgressDialog<unknown>;
  let fixture: ComponentFixture<HttpProgressDialog<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HttpProgressDialog],
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: of() },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpProgressDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
