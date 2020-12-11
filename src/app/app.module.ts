import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { MaterialModule } from './material.module';
import { GraphComponent } from './components/graph/graph.component';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';
import { HomePage } from './pages/home/home.page';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPage,
    GraphComponent,
    GraphEditorComponent,
    ModelCheckerPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
