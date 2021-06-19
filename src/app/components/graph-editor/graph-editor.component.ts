import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';

/**
 * Contains all components required to fully edit graphs.
 */
@Component({
  selector: 'apollo-graph-editor[graph]',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss'],
})
export class GraphEditorComponent {
  @Input() public graph!: Observable<D3Graph>;
  @Input() public graphExportRequests?: Observable<void>;
  @Output() public readonly saveRequested = new EventEmitter<FOLGraph>();
  @Output() public readonly graphExported = new EventEmitter<FOLGraph>();
}
