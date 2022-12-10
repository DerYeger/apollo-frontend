import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef, LegacyTextOnlySnackBar as TextOnlySnackBar } from '@angular/material/legacy-snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom, forkJoin, Observable, of } from 'rxjs';

import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { TranslationDTO } from 'src/app/model/dto/translation.dto';
import { storeGraph } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

/**
 * Service that provides methods for easy creation of SnackBar messages by translation keys.
 */
@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  public constructor(private readonly snackBar: MatSnackBar, private readonly translate: TranslateService, private readonly store: Store<State>, private readonly log: NGXLogger) {}

  /**
   * Opens a SnackBar with the given message.
   *
   * @param messageDTO The message to be shown.
   * @param actionDTO The optional action of the message.
   * @param duration The duration of the message. Defaults to 5 seconds.
   */
  public async openSnackBar(messageDTO: TranslationDTO, actionDTO?: TranslationDTO, duration: number | undefined = 5000): Promise<MatSnackBarRef<TextOnlySnackBar>> {
    const message$: Observable<string> = this.translate.get(messageDTO.key, messageDTO.params);
    const action$: Observable<string | undefined> = actionDTO ? this.translate.get(actionDTO.key, actionDTO.params) : of(undefined);
    const [message, action] = await firstValueFrom(forkJoin([message$, action$]));
    this.log.debug(`Openend SnackBar - Message: ${message} - Action: ${action}`);
    return this.snackBar.open(message, action, { duration });
  }

  /**
   * Informs the user about the deletion of a graph and has an undo-option.
   *
   * @param graph The deleted graph.
   */
  public graphDeleted(graph: FOLGraph): void {
    this.openSnackBar({ key: 'snackbar.graph-deleted', params: { name: graph.name } }, { key: 'actions.undo' }, 10000).then((snackBarRef) => {
      const subscription = snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(storeGraph(graph));
        subscription.unsubscribe();
      });
    });
  }
}
