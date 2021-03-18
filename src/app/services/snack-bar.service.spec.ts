import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { MaterialModule } from 'src/app/material.module';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { reducers } from 'src/app/store/reducers';

describe('SnackBarService', () => {
  let service: SnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    });
    service = TestBed.inject(SnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
