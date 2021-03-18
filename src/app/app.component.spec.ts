import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { AppComponent } from 'src/app/app.component';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardPage } from 'src/app/pages/dashboard/dashboard.page';
import { reducers } from 'src/app/store/reducers';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, DashboardPage, GraphEditorComponent, GraphComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
