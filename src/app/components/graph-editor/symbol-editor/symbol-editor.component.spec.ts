import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { SymbolEditorComponent } from 'src/app/components/graph-editor/symbol-editor/symbol-editor.component';
import { RELATION_SYMBOL_EDITOR_CONFIGURATION } from 'src/app/configurations/symbol-editor.configuration';
import { MaterialModule } from 'src/app/material.module';

describe('SymbolEditorComponent', () => {
  let component: SymbolEditorComponent;
  let fixture: ComponentFixture<SymbolEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SymbolEditorComponent],
      imports: [FormsModule, LoggerTestingModule, MaterialModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolEditorComponent);
    component = fixture.componentInstance;
    component.config = RELATION_SYMBOL_EDITOR_CONFIGURATION;
    component.symbols = new Set();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
