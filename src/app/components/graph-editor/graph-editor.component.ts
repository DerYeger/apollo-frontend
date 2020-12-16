import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import D3Graph from 'src/app/model/d3/d3.graph';
import { GRAPH_KEY, GRAPH_SOURCE, GraphCollection } from 'src/app/model/domain/graph.collection';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss'],
})
export class GraphEditorComponent {
  public readonly graph: Observable<D3Graph> = this.route.queryParams.pipe(
    map((params) => [params[GRAPH_SOURCE], params[GRAPH_KEY]]),
    filter(([source, key]) => source !== undefined && key !== undefined),
    mergeMap(([source, key]) =>
      this.store.select(source).pipe(
        map((graphs: GraphCollection) => graphs[key]),
        filter((graph) => graph !== undefined),
        mergeMap((graph) =>
          D3Graph.fromDomainGraph(graph).catch((error) => {
            window.alert(error);
            return new D3Graph();
          })
        )
      )
    )
  );

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {}
}
