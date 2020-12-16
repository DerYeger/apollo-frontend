import { Component, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GramofoRoute, routes } from 'src/app/app-routing.module';
import { setLanguage } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public readonly routes = routes.filter((route) => route.name !== undefined);

  @ViewChild('sidenav')
  private readonly sidenav!: MatSidenav;

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router
  ) {}

  setLanguage(event: MatButtonToggleChange): void {
    this.store.dispatch(setLanguage({ language: event.value }));
  }

  activateRoute(route: GramofoRoute): void {
    this.router
      .navigateByUrl(route.path ?? '')
      .then(() => this.sidenav.toggle());
  }
}
