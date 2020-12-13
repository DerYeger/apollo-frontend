import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MaterialModule } from 'src/app/material.module';
import { GraphComponent } from '../graph/graph.component';
import { LinkFormComponent } from './link-form/link-form.component';
import { NodeFormComponent } from './node-form/node-form.component';

import { GraphEditorComponent } from './graph-editor.component';

describe('GraphEditorComponent', () => {
  let component: GraphEditorComponent;
  let fixture: ComponentFixture<GraphEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphEditorComponent, GraphComponent, LinkFormComponent, NodeFormComponent],
      imports: [LoggerTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
