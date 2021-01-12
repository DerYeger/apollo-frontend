import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { FormulaSyntaxDialog } from 'src/app/components/dialogs/formula-syntax/formula-syntax.dialog';
import { HttpProgressDialog } from 'src/app/components/dialogs/http-progress/http-progress.dialog';
import { ResultTreeDialog } from 'src/app/components/dialogs/result-tree/result-tree.dialog';
import { Feedback } from 'src/app/model/api/model-checker-request';
import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
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
export class ModelCheckerPage implements OnDestroy {
  public readonly formula = new FormControl('', Validators.required);

  public readonly graphExportRequests = new EventEmitter<void>();

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

  private activeResultDialog?: MatDialogRef<ResultTreeDialog>;

  public constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly backendService: BackendService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.activeResultDialog?.close();
  }

  public onSaveRequested(domainGraph: FOLGraph): void {
    this.store.dispatch(storeGraph(domainGraph));
    this.router.navigate(['modelchecker'], { queryParams: graphCollectionQueryParams('graphStore', domainGraph.name) });
  }

  public requestGraphExport(): void {
    if (this.formula.invalid) {
      return;
    }
    this.activeResultDialog?.close();
    this.graphExportRequests.emit();
  }

  public checkModel(graph: FOLGraph, feedback: Feedback): void {
    const request = this.backendService.checkModel(graph, this.formula.value, feedback);
    const requestDialog = this.dialog.open<HttpProgressDialog<ModelCheckerResponse>>(HttpProgressDialog, {
      width: '90%',
      data: request,
      autoFocus: false,
    });
    requestDialog.afterOpened().subscribe(() => {
      this.activeResultDialog?.close();
      this.activeResultDialog = undefined;
    });
    requestDialog
      .afterClosed()
      .pipe(filter((response) => response !== undefined))
      .subscribe((response) => {
        this.activeResultDialog = this.dialog.open(ResultTreeDialog, {
          width: response.rootTrace.children ? '70%' : undefined,
          height: response.rootTrace.children ? '90%' : undefined,
          data: response,
          autoFocus: false,
          hasBackdrop: false,
        });
      });
  }

  public showFormulaSyntaxDialog(): void {
    this.dialog.open(FormulaSyntaxDialog, {
      minWidth: '50%',
      panelClass: 'unpadded-dialog',
    });
  }
}
