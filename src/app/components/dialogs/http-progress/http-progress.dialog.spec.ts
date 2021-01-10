import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

import { HttpProgressDialog } from './http-progress.dialog';

describe('HttpProgressDialog', () => {
  let component: HttpProgressDialog<unknown>;
  let fixture: ComponentFixture<HttpProgressDialog<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HttpProgressDialog],
      imports: [MaterialModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), LoggerTestingModule],
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
