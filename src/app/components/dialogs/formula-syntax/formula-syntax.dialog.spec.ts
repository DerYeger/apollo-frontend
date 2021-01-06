import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';

import { FormulaSyntaxDialog } from './formula-syntax.dialog';

describe('FormulaSyntaxDialog', () => {
  let component: FormulaSyntaxDialog;
  let fixture: ComponentFixture<FormulaSyntaxDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormulaSyntaxDialog],
      imports: [MaterialModule, TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaSyntaxDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
