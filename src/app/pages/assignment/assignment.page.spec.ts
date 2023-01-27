import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { GraphComponent } from 'src/app/components/graph/graph.component';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { LinkFormComponent } from 'src/app/components/graph-editor/link-form/link-form.component';
import { NodeFormComponent } from 'src/app/components/graph-editor/node-form/node-form.component';
import { MaterialModule } from 'src/app/material.module';
import { AssignmentPage } from 'src/app/pages/assignment/assignment.page';
import { AssignmentsPage } from 'src/app/pages/assignments/assignments.page';
import { reducers } from 'src/app/store/reducers';

describe('AssignmentPage', () => {
  let component: AssignmentPage;
  let fixture: ComponentFixture<AssignmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentPage, GraphComponent, GraphEditorComponent, LinkFormComponent, NodeFormComponent],
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        MaterialModule,
        RouterTestingModule.withRoutes([{ path: 'assignments', component: AssignmentsPage }]),
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
