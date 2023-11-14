import { ApplicationRef, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { NGXLogger } from 'ngx-logger';
import { concat, interval, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { UpdateAvailableDialog } from 'src/app/dialogs/update-available/update-available.dialog';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private checkForUpdateSubscription?: Subscription;
  private updateAvailableSubscription?: Subscription;
  private updateActivatedSubscription?: Subscription;

  public constructor(
    private readonly appRef: ApplicationRef,
    private readonly dialog: MatDialog,
    private readonly log: NGXLogger,
    private readonly swUpdate: SwUpdate,
  ) {}

  public start(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    if (this.checkForUpdateSubscription !== undefined || this.updateAvailableSubscription !== undefined || this.updateActivatedSubscription !== undefined) {
      this.stop();
    }

    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable));
    const everyThirtyMinutes$ = interval(30 * 60 * 1000);
    const everyThirtyMinutesOnceAppIsStable$ = concat(appIsStable$, everyThirtyMinutes$);
    this.checkForUpdateSubscription = everyThirtyMinutesOnceAppIsStable$.subscribe(() => {
      this.log.debug('Checking for updates');
      return this.swUpdate.checkForUpdate();
    });

    this.swUpdate.checkForUpdate().then(() => {
      this.log.debug('Update available');
      this.dialog
        .open(UpdateAvailableDialog)
        .afterClosed()
        .subscribe(async () => {
          this.log.debug('Updating');
          await this.swUpdate.activateUpdate();
          return document.location.reload();
        });
    });

    this.log.debug('UpdateService started');
  }

  public stop(): void {
    this.checkForUpdateSubscription?.unsubscribe();
    this.updateAvailableSubscription?.unsubscribe();
    this.updateActivatedSubscription?.unsubscribe();

    this.log.debug('UpdateService stopped');
  }
}
