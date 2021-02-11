import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomePage } from './pages/home/home.page';
import { ModelCheckerPage } from './pages/model-checker/model-checker.page';

/**
 * Extends Route to provide additional data.
 */
export interface GramofoRoute extends Route {
  /**
   * Used for providing translations keys to the navigation menu.
   */
  name?: string;
}

export type GramofoRoutes = GramofoRoute[];

/**
 * The routes of this app.
 */
export const routes: GramofoRoutes = [
  { path: 'home', name: 'home.title', component: HomePage },
  { path: 'modelchecker', name: 'model-checker.title', component: ModelCheckerPage },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

/**
 * Defines all routes of the app and configures the RoutingModule.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes), TranslateModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
