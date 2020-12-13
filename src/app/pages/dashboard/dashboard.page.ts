import { Component } from '@angular/core';
import { routes } from 'src/app/app-routing.module';

@Component({
  selector: 'gramofo-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public readonly routes = routes;
}
