import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { forkJoin, Observable, of } from 'rxjs';

import { FOLGraph } from '../model/domain/fol.graph';
import { TranslationDTO } from '../model/dto/translation.dto';
import { storeGraph } from '../store/actions';
import { State } from '../store/state';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private readonly snackBar: MatSnackBar, private readonly translate: TranslateService, private readonly store: Store<State>, private readonly log: NGXLogger) {}

  public async openSnackBar(messageDTO: TranslationDTO, actionDTO?: TranslationDTO, duration: number | undefined = 5000): Promise<MatSnackBarRef<TextOnlySnackBar>> {
    const message$: Observable<string> = this.translate.get(messageDTO.key, messageDTO.params);
    const action$: Observable<string | undefined> = actionDTO ? this.translate.get(actionDTO.key, actionDTO.params) : of(undefined);
    const [message, action] = await forkJoin([message$, action$]).toPromise();
    this.log.debug(`Openend SnackBar - Message: ${message} - Action: ${action}`);
    return this.snackBar.open(message, action, { duration });
  }

  public graphDeleted(graph: FOLGraph): void {
    this.openSnackBar({ key: 'snackbar.graph-deleted', params: { name: graph.name } }, { key: 'actions.undo' }, 10000).then((snackBarRef) => {
      const subscription = snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(storeGraph(graph));
        subscription.unsubscribe();
      });
    });
  }
}
