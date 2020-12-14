import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Store } from '@ngrx/store';
import { routes } from 'src/app/app-routing.module';
import { setLanguage } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public readonly routes = routes.filter((route) => route.name !== undefined);

  constructor(private readonly store: Store<State>) {}

  setLanguage(event: MatButtonToggleChange): void {
    this.store.dispatch(setLanguage({ language: event.value }));
  }
}
