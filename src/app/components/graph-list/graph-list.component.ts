import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FOLGraph } from 'src/app/model/domain/fol.graph';

import { ExportGraphBottomSheet } from '../bottom-sheets/export-graph/export-graph.bottom-sheet';

@Component({
  selector: 'gramofo-graph-list[graphs]',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.scss'],
})
export class GraphListComponent implements OnChanges, AfterViewInit {
  public readonly columns: string[] = ['name', 'description', 'lastEdit', 'actions'];

  @Input() public graphs!: FOLGraph[] | null;

  public readonly dataSource = new MatTableDataSource<FOLGraph>([]);

  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  @Output() public readonly graphSelected = new EventEmitter<FOLGraph>();
  @Output() public readonly graphDeletionRequested = new EventEmitter<FOLGraph>();

  constructor(private readonly bottomSheet: MatBottomSheet) {}

  ngOnChanges(_: SimpleChanges): void {
    if (this.graphs !== null) {
      this.dataSource.data = this.graphs;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  exportGraph(graph: FOLGraph): void {
    this.bottomSheet.open(ExportGraphBottomSheet, {
      data: graph,
    });
  }
}
