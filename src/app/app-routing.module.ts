import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomePage } from 'src/app/pages/home/home.page';
import { ModelCheckerPage } from 'src/app/pages/model-checker/model-checker.page';

/**
 * Extends Route to provide additional data.
 */
export interface ApolloRoute extends Route {
  /**
   * Used for providing translations keys to the navigation menu.
   */
  name?: string;
}

export type ApolloRoutes = ApolloRoute[];

/**
 * The routes of this app.
 */
export const routes: ApolloRoutes = [
  { path: '', name: 'home.title', component: HomePage },
  { path: 'model-checker', name: 'model-checker.title', component: ModelCheckerPage },
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
