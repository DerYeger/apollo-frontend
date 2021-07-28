import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_COLOR_SCHEME, LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ExportGraphBottomSheet } from 'src/app/bottom-sheets/export-graph/export-graph.bottom-sheet';
import { AssignmentCardComponent } from 'src/app/components/assignment-card/assignment-card.component';
import { FeedbackSelectionComponent } from 'src/app/components/feedback-selection/feedback-selection.component';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { LinkFormComponent } from 'src/app/components/graph-editor/link-form/link-form.component';
import { NodeFormComponent } from 'src/app/components/graph-editor/node-form/node-form.component';
import { SymbolEditorComponent } from 'src/app/components/graph-editor/symbol-editor/symbol-editor.component';
import { GraphImportComponent } from 'src/app/components/graph-import/graph-import.component';
import { GraphListComponent } from 'src/app/components/graph-list/graph-list.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { FormulaSyntaxDialog } from 'src/app/dialogs/formula-syntax/formula-syntax.dialog';
import { HttpProgressDialog } from 'src/app/dialogs/http-progress/http-progress.dialog';
import { ResultTreeDialog } from 'src/app/dialogs/result-tree/result-tree.dialog';
import { TraceComponent } from 'src/app/dialogs/result-tree/trace/trace.component';
import { SaveGraphDialog } from 'src/app/dialogs/save-graph/save-graph.dialog';
import { UpdateAvailableDialog } from 'src/app/dialogs/update-available/update-available.dialog';
import { MaterialModule } from 'src/app/material.module';
import { AssignmentPage } from 'src/app/pages/assignment/assignment.page';
import { AssignmentsPage } from 'src/app/pages/assignments/assignments.page';
import { DashboardPage } from 'src/app/pages/dashboard/dashboard.page';
import { HomePage } from 'src/app/pages/home/home.page';
import { ModelCheckerPage } from 'src/app/pages/model-checker/model-checker.page';
import { metaReducers, reducers } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';

/**
 * Main module of the app. Declares all components and imports third-party modules.
 */
@NgModule({
  declarations: [
    AppComponent,
    AssignmentCardComponent,
    AssignmentPage,
    AssignmentsPage,
    DashboardPage,
    ExportGraphBottomSheet,
    FeedbackSelectionComponent,
    FormulaSyntaxDialog,
    GraphComponent,
    GraphEditorComponent,
    GraphImportComponent,
    GraphListComponent,
    HomePage,
    HttpProgressDialog,
    LinkFormComponent,
    ModelCheckerPage,
    NodeFormComponent,
    ResultTreeDialog,
    SaveGraphDialog,
    SymbolEditorComponent,
    TraceComponent,
    UpdateAvailableDialog,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ClipboardModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
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
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(reducers, { metaReducers }),
    TranslateModule.forRoot({}),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
