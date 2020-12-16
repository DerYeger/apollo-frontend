import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { graphCollectionQueryParams } from 'src/app/model/domain/graph.collection';
import { cacheGraph } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private readonly demoData: FOLGraph = {
    name: 'Demo',
    nodes: [
      { name: '0', relations: [], constants: ['a', 'd', 'f'] },
      { name: '1', relations: [], constants: ['b'] },
      { name: '2', relations: [], constants: ['c'] },
      { name: '3', relations: [], constants: ['g'] },
    ],
    edges: [
      { source: '0', target: '0', relations: ['R'], functions: [] },
      { source: '0', target: '1', relations: ['A'], functions: [] },
      { source: '1', target: '2', relations: ['B'], functions: [] },
      { source: '2', target: '1', relations: ['B'], functions: [] },
    ],
  };

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  public readonly storedGraphNames = this.store.select('graphStore').pipe(map((graphs) => Object.keys(graphs)));

  public loadDemoData(): void {
    // TODO add validation method
    D3Graph.fromDomainGraph(this.demoData)
      .then((_) => this.store.dispatch(cacheGraph(this.demoData)))
      .then(() => this.router.navigate(['modelchecker'], { queryParams: graphCollectionQueryParams('graphCache', this.demoData.name) }))
      .catch((error) => window.alert(error));
  }

  public onGraphSelected(graphName: string): void {
    this.router.navigate(['modelchecker'], { queryParams: graphCollectionQueryParams('graphStore', graphName) });
  }
}
