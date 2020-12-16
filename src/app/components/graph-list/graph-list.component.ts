import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gramofo-graph-list[graphNames]',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.scss'],
})
export class GraphListComponent {
  @Input() graphNames!: string[] | null;

  @Output() graphSelected = new EventEmitter<string>();

  selectGraph(graphName: string): void {
    this.graphSelected.emit(graphName);
  }
}
