import { Component, OnDestroy, OnInit } from '@angular/core';
import localeDe from '@angular/common/locales/en';
import localeEn from '@angular/common/locales/en';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { registerLocaleData } from '@angular/common';
import { State } from './store/state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setLanguage } from './store/actions';

@Component({
  selector: 'gramofo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  private readonly languages = {
    en: localeEn,
    de: localeDe,
  };

  private settingsSubscription?: Subscription;

  constructor(private readonly store: Store<State>, private readonly translate: TranslateService, private readonly log: NGXLogger) {
    Object.entries(this.languages).forEach(([language, locale]) => {
      translate.setTranslation(language, require(`../assets/i18n/${language}.json`));
      registerLocaleData(locale);
      log.debug(`Language ${language} registered.`);
    });
  }

  ngOnInit(): void {
    this.settingsSubscription = this.store.select('settings').subscribe((settings) => {
      const language = settings.language ?? this.translate.getBrowserLang();
      this.log.info(`Set ${language} as current language.`);
      this.translate.use(language);
    });
  }

  ngOnDestroy(): void {
    this.settingsSubscription?.unsubscribe();
  }
}
