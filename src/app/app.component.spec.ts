import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AppComponent } from './app.component';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { GraphComponent } from './components/graph/graph.component';
import { MaterialModule } from './material.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { reducers } from './store/reducers';

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
