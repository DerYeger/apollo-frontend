import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GraphDefinition } from 'src/app/model/domain/graph.definition';

@Component({
  selector: 'gramofo-graph-list[graphDefinitions]',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.scss'],
})
export class GraphListComponent implements OnChanges, AfterViewInit {
  public readonly columns: string[] = ['name', 'lastEdit', 'actions'];

  @Input() public graphDefinitions!: GraphDefinition[] | null;

  public readonly dataSource = new MatTableDataSource<GraphDefinition>([]);

  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  @Output() public readonly graphDefinitionSelected = new EventEmitter<GraphDefinition>();
  @Output() public readonly graphDefinitionDeletionRequested = new EventEmitter<GraphDefinition>();

  ngOnChanges(_: SimpleChanges): void {
    if (this.graphDefinitions !== null) {
      this.dataSource.data = this.graphDefinitions;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    console.log(this.sort);
  }
}
