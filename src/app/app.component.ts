import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { UpdateService } from 'src/app/services/update.service';
import {setLanguage, setSidebar} from 'src/app/store/actions';
import { Language, State } from 'src/app/store/state';

/**
 * Root component of the app.
 * Manages languages and themes.
 * Sets the default values upon initialization.
 */
@Component({
  selector: 'apollo-root',
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

  public constructor(
    private readonly log: NGXLogger,
    private readonly store: Store<State>,
    private readonly translate: TranslateService,
    private readonly updateService: UpdateService
  ) {
    Object.entries(this.languages).forEach(([language, locale]) => {
      translate.setTranslation(language, require(`../assets/i18n/${language}.json`));
      registerLocaleData(locale);
      log.debug(`Language ${language} registered.`);
    });
    this.updateService.start();
  }

  /**
   * Subscribes to setting-changes.
   */
  public ngOnInit(): void {
    this.languageSubscription = this.store
      .select('settings')
      .pipe(
        map((settings) => settings.language),
        distinctUntilChanged()
      )
      .subscribe((language) => {
        if (language === undefined) {
          const browserLanguage = this.translate.getBrowserLang() as Language;
          const initialLanguage = browserLanguage === 'en' || browserLanguage === 'de' ? browserLanguage : 'en';
          this.store.dispatch(setLanguage({ language: initialLanguage }));
        } else {
          this.log.info(`Set ${language} as current language.`);
          this.translate.use(language);
        }
      });

    this.themeSubscription = this.store
      .select('settings')
      .pipe(
        map((settings) => settings.theme),
        distinctUntilChanged()
      )
      .subscribe((theme) =>
        d3
          .select(document.body)
          .classed('dark-theme', 'dark-theme' === theme)
          .classed('light-theme', 'light-theme' === theme)
      );

    this.store.dispatch(setSidebar({expanded: false}));
  }

  /**
   * Unsubscribes from setting-changes.
   */
  public ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
    this.updateService.stop();
  }
}
