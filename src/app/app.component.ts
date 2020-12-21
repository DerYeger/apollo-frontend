import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { State, Theme } from './store/state';

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

  private languageSubscription?: Subscription;
  private themeSubscription?: Subscription;

  constructor(private readonly store: Store<State>, private readonly translate: TranslateService, private readonly log: NGXLogger) {
    Object.entries(this.languages).forEach(([language, locale]) => {
      translate.setTranslation(language, require(`../assets/i18n/${language}.json`));
      registerLocaleData(locale);
      log.debug(`Language ${language} registered.`);
    });
  }

  ngOnInit(): void {
    this.languageSubscription = this.store
      .select('settings')
      .pipe(
        map((settings) => settings.language),
        distinctUntilChanged()
      )
      .subscribe((language) => {
        const newLanguage = language ?? this.translate.getBrowserLang();
        this.log.info(`Set ${newLanguage} as current language.`);
        this.translate.use(newLanguage);
      });

    this.themeSubscription = this.store
      .select('settings')
      .pipe(map((settings) => settings.theme))
      .subscribe((theme) =>
        d3
          .select(document.body)
          .classed('dark-theme', 'dark-theme' === theme)
          .classed('light-theme', 'light-theme' === theme)
      );
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
  }
}
