import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { FormulaSyntaxDialog } from 'src/app/components/dialogs/formula-syntax/formula-syntax.dialog';
import { ResultTreeDialog } from 'src/app/components/result-tree/result-tree.dialog';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { GRAPH_KEY, GRAPH_SOURCE, GraphCollection, graphCollectionQueryParams } from 'src/app/model/domain/graph.collection';
import { BackendService } from 'src/app/services/backend.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { storeGraph } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-model-checker',
  templateUrl: './model-checker.page.html',
  styleUrls: ['./model-checker.page.scss'],
})
export class ModelCheckerPage {
  public readonly formula = new FormControl('', Validators.required);

  public readonly graphExportRequests = new EventEmitter<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly backendService: BackendService,
    private readonly dialog: MatDialog
  ) {}

  public readonly graph: Observable<D3Graph> = this.route.queryParams.pipe(
    map((params) => [params[GRAPH_SOURCE], params[GRAPH_KEY]]),
    filter(([source, key]) => source !== undefined && key !== undefined),
    mergeMap(([source, key]) =>
      this.store.select(source).pipe(
        map((graphs: GraphCollection) => graphs[key]),
        filter((graph) => graph !== undefined),
        mergeMap((graph) =>
          D3Graph.fromDomainGraph(graph).catch((error) => {
            this.snackBarService.openSnackBar(error);
            return new D3Graph();
          })
        )
      )
    )
  );

  public onSaveRequested(domainGraph: FOLGraph): void {
    this.store.dispatch(storeGraph(domainGraph));
    this.router.navigate(['modelchecker'], { queryParams: graphCollectionQueryParams('graphStore', domainGraph.name) });
  }

  public requestGraphExport(): void {
    if (this.formula.invalid) {
      return;
    }
    this.graphExportRequests.emit();
  }

  public checkModel(graph: FOLGraph): void {
    this.backendService
      .checkModel(graph, this.formula.value)
      .then((response) => {
        this.dialog.open(ResultTreeDialog, {
          role: 'dialog',
          width: '90%',
          height: '90%',
          data: response,
          autoFocus: false,
        });
      })
      .catch((error) => {
        const message = error?.error?.message ?? error.message;
        if (typeof message === 'string') {
          this.snackBarService.openSnackBar({ key: message }, undefined, 10000);
        } else {
          this.snackBarService.openSnackBar(error?.error?.message, undefined, 10000);
        }
      });
  }

  public showFormulaSyntaxDialog(): void {
    this.dialog.open(FormulaSyntaxDialog, {
      minWidth: '50%',
      panelClass: 'unpadded-dialog',
    });
  }
}
