import { browser, by, element } from 'protractor';

export class AppPage {
  public async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  public async getDashboardTitleText(): Promise<string> {
    return element(by.css('h1.title')).getText();
  }
}
