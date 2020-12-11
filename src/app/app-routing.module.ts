import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';

export interface GramofoRoute extends Route {
  name?: string;
}

export declare type GramofoRoutes = GramofoRoute[];

export const routes: GramofoRoutes = [
  { path: 'home', name: 'Home', component: HomePage },
  { path: 'modelchecker', name: 'ModelChecker', component: ModelCheckerPage },
  { path: '**', redirectTo: 'modelchecker', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
