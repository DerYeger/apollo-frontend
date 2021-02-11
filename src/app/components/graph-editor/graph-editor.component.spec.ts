import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

import { GraphComponent } from '../graph/graph.component';
import { GraphEditorComponent } from './graph-editor.component';
import { LinkFormComponent } from './link-form/link-form.component';
import { NodeFormComponent } from './node-form/node-form.component';

describe('GraphEditorComponent', () => {
  let component: GraphEditorComponent;
  let fixture: ComponentFixture<GraphEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphEditorComponent, GraphComponent, LinkFormComponent, NodeFormComponent],
      imports: [LoggerTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), MaterialModule, AppRoutingModule],
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
