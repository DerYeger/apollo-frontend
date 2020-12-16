import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import D3Graph from 'src/app/model/d3/d3.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';

@Component({
  selector: 'gramofo-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss'],
})
export class GraphEditorComponent {
  private readonly demoData: FOLGraph = {
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

  public readonly demoDomainGraph = D3Graph.fromDomainGraph(this.demoData).catch((error) => {
    this.log.error(error);
    window.alert(error);
    return new D3Graph();
  });

  constructor(private readonly log: NGXLogger) {}
}
