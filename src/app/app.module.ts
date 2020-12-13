import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_COLOR_SCHEME, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { GraphComponent } from './components/graph/graph.component';
import { MaterialModule } from './material.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { HomePage } from './pages/home/home.page';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';
import { NodeFormComponent } from './components/graph-editor/node-form/node-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LinkFormComponent } from './components/graph-editor/link-form/link-form.component';
import { SymbolEditorComponent } from './components/graph-editor/symbol-editor/symbol-editor.component';

@NgModule({
  declarations: [AppComponent, DashboardPage, GraphComponent, GraphEditorComponent, ModelCheckerPage, HomePage, NodeFormComponent, LinkFormComponent, SymbolEditorComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
