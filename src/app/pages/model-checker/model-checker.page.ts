import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { GraphCollection, graphCollectionQueryParams, GRAPH_KEY, GRAPH_SOURCE } from 'src/app/model/domain/graph.collection';
import { storeGraph } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-model-checker',
  templateUrl: './model-checker.page.html',
  styleUrls: ['./model-checker.page.scss'],
})
export class ModelCheckerPage {
  constructor(private readonly store: Store<State>, private readonly router: Router, private readonly route: ActivatedRoute) {}

  public readonly graph: Observable<D3Graph> = this.route.queryParams.pipe(
    map((params) => [params[GRAPH_SOURCE], params[GRAPH_KEY]]),
    filter(([source, key]) => source !== undefined && key !== undefined),
    mergeMap(([source, key]) =>
      this.store.select(source).pipe(
        map((graphs: GraphCollection) => graphs[key]),
        filter((graphDefinition) => graphDefinition !== undefined),
        mergeMap((graphDefinition) =>
          D3Graph.fromDomainGraph(graphDefinition.graph).catch((error) => {
            window.alert(error);
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
}
