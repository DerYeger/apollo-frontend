import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ExportGraphBottomSheet } from 'src/app/bottom-sheets/export-graph/export-graph.bottom-sheet';
import { FOLGraph } from 'src/app/model/domain/fol.graph';

/**
 * Table that displays a list of graphs.
 * Has options to export, open and delete graphs.
 * The latter two have to be handled by the containing component.
 */
@Component({
  selector: 'apollo-graph-list[graphs]',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.scss'],
})
export class GraphListComponent implements OnChanges, AfterViewInit {
  @Input() public graphs!: FOLGraph[] | null;

  @Output() public readonly graphSelected = new EventEmitter<FOLGraph>();
  @Output() public readonly graphDeletionRequested = new EventEmitter<FOLGraph>();

  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  public readonly columns: string[] = ['name', 'description', 'lastEdit', 'actions'];

  public readonly dataSource = new MatTableDataSource<FOLGraph>([]);

  public constructor(private readonly bottomSheet: MatBottomSheet) {}

  public ngOnChanges(_: SimpleChanges): void {
    if (this.graphs !== null) {
      this.dataSource.data = this.graphs;
    }
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public exportGraph(graph: FOLGraph): void {
    this.bottomSheet.open(ExportGraphBottomSheet, {
      data: graph,
    });
  }
}
