import { Component } from '@angular/core';
import localeDe from '@angular/common/locales/en';
import localeEn from '@angular/common/locales/en';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'gramofo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly languages = {
    en: localeEn,
    de: localeDe,
  };

  constructor(translate: TranslateService, log: NGXLogger) {
    Object.entries(this.languages).forEach(([language, locale]) => {
      translate.setTranslation(language, require(`../assets/i18n/${language}.json`));
      registerLocaleData(locale);
      log.debug(`Language ${language} registered.`);
    });

    translate.setDefaultLang(Object.keys(this.languages)[0]);
    translate.use(translate.getBrowserLang());
    log.info(`Set ${translate.currentLang} as current language.`);
  }
}
