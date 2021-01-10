import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_COLOR_SCHEME, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExportGraphBottomSheet } from './components/bottom-sheets/export-graph/export-graph.bottom-sheet';
import { FormulaSyntaxDialog } from './components/dialogs/formula-syntax/formula-syntax.dialog';
import { HttpProgressDialog } from './components/dialogs/http-progress/http-progress.dialog';
import { ResultTreeDialog } from './components/dialogs/result-tree/result-tree.dialog';
import { TraceComponent } from './components/dialogs/result-tree/trace/trace.component';
import { SaveGraphDialog } from './components/dialogs/save-graph/save-graph.dialog';
import { FeedbackSelectionComponent } from './components/feedback-selection/feedback-selection.component';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { LinkFormComponent } from './components/graph-editor/link-form/link-form.component';
import { NodeFormComponent } from './components/graph-editor/node-form/node-form.component';
import { SymbolEditorComponent } from './components/graph-editor/symbol-editor/symbol-editor.component';
import { GraphImportComponent } from './components/graph-import/graph-import.component';
import { GraphListComponent } from './components/graph-list/graph-list.component';
import { GraphComponent } from './components/graph/graph.component';
import { MaterialModule } from './material.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { HomePage } from './pages/home/home.page';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';
import { metaReducers, reducers } from './store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPage,
    GraphComponent,
    GraphEditorComponent,
    ModelCheckerPage,
    HomePage,
    NodeFormComponent,
    LinkFormComponent,
    SymbolEditorComponent,
    GraphListComponent,
    SaveGraphDialog,
    ExportGraphBottomSheet,
    GraphImportComponent,
    ResultTreeDialog,
    TraceComponent,
    FormulaSyntaxDialog,
    FeedbackSelectionComponent,
    HttpProgressDialog,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ClipboardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    TranslateModule.forRoot({}),
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF,
      serverLoggingUrl: undefined,
      disableConsoleLogging: false,
      enableSourceMaps: !environment.production,
      timestampFormat: undefined,
      colorScheme: DEFAULT_COLOR_SCHEME,
      httpResponseType: 'json',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
