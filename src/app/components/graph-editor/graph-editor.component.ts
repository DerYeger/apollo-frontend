import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { GRAPH_KEY, GRAPH_SOURCE, GraphCollection } from 'src/app/model/domain/graph.collection';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-graph-editor[graph]',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss'],
})
export class GraphEditorComponent {
  @Input() public graph!: Observable<D3Graph>;
  @Output() public readonly saveRequested = new EventEmitter<FOLGraph>();
}
