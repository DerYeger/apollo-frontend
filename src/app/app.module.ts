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

@NgModule({
  declarations: [AppComponent, DashboardPage, GraphComponent, GraphEditorComponent, ModelCheckerPage, HomePage],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({}),
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF,
      serverLoggingUrl: undefined,
      disableConsoleLogging: false,
      enableSourceMaps: false,
      timestampFormat: undefined,
      colorScheme: DEFAULT_COLOR_SCHEME,
      httpResponseType: 'json',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
