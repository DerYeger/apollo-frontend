import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { GraphCollection, graphCollectionQueryParams, GRAPH_KEY, GRAPH_SOURCE } from 'src/app/model/domain/graph.collection';
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
    private readonly backendService: BackendService
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

  public checkModel(graph: FOLGraph): void {
    this.backendService.checkModel(graph, this.formula.value).then((response) => {
      console.table(response);
      window.alert(response.error ?? true);
    }).catch((error) => {
      console.table(error);
      window.alert(error);
    });
  }
}
