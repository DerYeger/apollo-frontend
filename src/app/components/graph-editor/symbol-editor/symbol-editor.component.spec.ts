import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RELATION_SYMBOL_EDITOR_CONFIGURATION } from 'src/app/configurations/symbol-editor.configuration';

import { SymbolEditorComponent } from './symbol-editor.component';

describe('SymbolEditorComponent', () => {
  let component: SymbolEditorComponent;
  let fixture: ComponentFixture<SymbolEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolEditorComponent ],
      imports: [
        LoggerTestingModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
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
