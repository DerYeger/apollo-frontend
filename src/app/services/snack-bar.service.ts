import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { forkJoin, Observable, of } from 'rxjs';
import { FOLGraph } from '../model/domain/fol.graph';

export interface TranslationDTO {
  key: string;
  params?: object;
}

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private readonly snackBar: MatSnackBar, private readonly translate: TranslateService, private readonly log: NGXLogger) {}

  public openSnackBar(messageDTO: TranslationDTO, actionDTO?: TranslationDTO, duration: number | undefined = 2000): void {
    const message$: Observable<string> = this.translate.get(messageDTO.key, messageDTO.params);
    const action$: Observable<string | undefined> = actionDTO ? this.translate.get(actionDTO.key, actionDTO.params) : of(undefined);
    forkJoin([message$, action$])
      .toPromise()
      .then(([message, action]) => {
        this.log.debug(`Openend SnackBar - Message: ${message} - Action: ${action}`);
        this.snackBar.open(message, action, { duration });
      });
  }

  public graphDeleted(graph: FOLGraph): void {
    this.openSnackBar({ key: 'snackbar.graph-deleted', params: { name: graph.name } }, undefined, 2000);
  }
}
