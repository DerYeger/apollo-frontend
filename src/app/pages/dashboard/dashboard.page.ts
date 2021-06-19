import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { routes } from 'src/app/app-routing.module';
import { setLanguage, toggleSidebar, toggleTheme } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

/**
 * Dashboard-frame of the app.
 * Contains navigation, language selection, theme selection and a link to this app's repository.
 */
@Component({
  selector: 'apollo-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public readonly routes = routes.filter((route) => route.name !== undefined);

  public readonly language$ = this.store.select('settings').pipe(map((settings) => settings.language));
  public readonly sidebar$ = this.store.select('settings').pipe(map((settings) => settings.sidebar));

  public readonly themeButtonIcon$ = this.store.select('settings').pipe(map((settings) => (settings.theme === 'dark-theme' ? 'light_mode' : 'dark_mode')));

  public constructor(private readonly store: Store<State>) {}

  public toggleSidebar(): void {
    this.store.dispatch(toggleSidebar());
  }

  public setLanguage(event: MatButtonToggleChange): void {
    this.store.dispatch(setLanguage({ language: event.value }));
  }

  public toggleTheme(): void {
    this.store.dispatch(toggleTheme());
  }
}
