import { TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { MaterialModule } from 'src/app/material.module';
import { UpdateService } from 'src/app/services/update.service';

describe('UpdateService', () => {
  let service: UpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, MaterialModule, ServiceWorkerModule.register('', { enabled: false })],
    });
    service = TestBed.inject(UpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
