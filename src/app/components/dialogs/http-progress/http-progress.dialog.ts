import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snack-bar.service';

type State = 'sending' | 'querying' | 'fetching';

@Component({
  templateUrl: './http-progress.dialog.html',
  styleUrls: ['./http-progress.dialog.scss'],
})
export class HttpProgressDialog<T> implements OnDestroy {
  private readonly state = new EventEmitter<State>();

  public readonly progress$ = new EventEmitter<number>();

  public readonly progressMode$: Observable<ProgressBarMode> = this.state.pipe(
    map((state) => {
      switch (state) {
        case 'sending':
          return 'buffer';
        case 'querying':
          return 'query';
        default:
          return 'determinate';
      }
    })
  );

  private requestSubscription?: Subscription;

  public constructor(
    private readonly dialogRef: MatDialogRef<HttpProgressDialog<T>>,
    @Inject(MAT_DIALOG_DATA) private readonly request: Observable<HttpEvent<T>>,
    private readonly snackBarService: SnackBarService
  ) {
    dialogRef.disableClose = true;
    this.requestSubscription = this.request.pipe(catchError((error) => this.onError(error))).subscribe((event) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.onSent();
          break;
        case HttpEventType.ResponseHeader:
          this.onHeaderReceived();
          break;
        case HttpEventType.DownloadProgress:
          this.onProgress(event);
          break;
        case HttpEventType.Response:
          this.onResponse(event);
      }
    });
  }

  public ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }

  public cancelRequest(): void {
    this.dialogRef.close();
  }

  private onSent(): void {
    this.state.emit('querying');
  }

  private onHeaderReceived(): void {
    this.state.emit('fetching');
  }

  private onProgress(progress: HttpProgressEvent): void {
    const current = progress.loaded;
    // Use maximum safe integer as fallback, if no Content-Length Header is present.
    const total = progress.total ?? Number.MAX_SAFE_INTEGER;
    this.progress$.emit((100 * current) / total);
  }

  private onResponse(response: HttpResponse<T>): void {
    const body = response.body;
    if (body === undefined || body === null) {
      this.onError({ error: { message: 'api.error.unknown' } });
    } else {
      this.dialogRef.close(response.body);
    }
  }

  private onError(error: any): Observable<HttpEvent<T>> {
    // Delay closing of dialog to prevent flickering.
    setTimeout(() => this.dialogRef.close(), 250);
    const message = error?.error?.message ?? 'api.error.unknown';
    if (typeof message === 'string') {
      this.snackBarService.openSnackBar({ key: message }, undefined, 10000);
    } else {
      // Message is TranslationDTO.
      this.snackBarService.openSnackBar(error?.error?.message, undefined, 10000);
    }
    return of();
  }
}
