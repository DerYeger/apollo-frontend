import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async getDashboardTitleText(): Promise<string> {
    return element(by.css('h1.title')).getText();
  }
}
