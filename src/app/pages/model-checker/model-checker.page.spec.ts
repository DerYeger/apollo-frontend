import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { LinkFormComponent } from 'src/app/components/graph-editor/link-form/link-form.component';
import { NodeFormComponent } from 'src/app/components/graph-editor/node-form/node-form.component';
import { MaterialModule } from 'src/app/material.module';

import { ModelCheckerPage } from './model-checker.page';

describe('ModelCheckerPage', () => {
  let component: ModelCheckerPage;
  let fixture: ComponentFixture<ModelCheckerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelCheckerPage, GraphEditorComponent, GraphComponent, LinkFormComponent, NodeFormComponent],
      imports: [LoggerTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
