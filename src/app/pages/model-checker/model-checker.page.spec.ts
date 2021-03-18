import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { FeedbackSelectionComponent } from 'src/app/components/feedback-selection/feedback-selection.component';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { LinkFormComponent } from 'src/app/components/graph-editor/link-form/link-form.component';
import { NodeFormComponent } from 'src/app/components/graph-editor/node-form/node-form.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { MaterialModule } from 'src/app/material.module';
import { ModelCheckerPage } from 'src/app/pages/model-checker/model-checker.page';
import { reducers } from 'src/app/store/reducers';

describe('ModelCheckerPage', () => {
  let component: ModelCheckerPage;
  let fixture: ComponentFixture<ModelCheckerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackSelectionComponent, GraphComponent, GraphEditorComponent, ModelCheckerPage, LinkFormComponent, NodeFormComponent],
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
      ],
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
