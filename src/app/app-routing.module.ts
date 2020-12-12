import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './pages/home/home.page';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';

export interface GramofoRoute extends Route {
  name?: string;
}

export declare type GramofoRoutes = GramofoRoute[];

export const routes: GramofoRoutes = [
  { path: 'home', name: 'home.name', component: HomePage },
  { path: 'modelchecker', name: 'model-checker.name', component: ModelCheckerPage },
  { path: '**', redirectTo: 'modelchecker', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    TranslateModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
