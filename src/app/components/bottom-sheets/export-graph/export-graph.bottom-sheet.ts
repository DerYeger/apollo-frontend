import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { terminate } from 'src/app/utils/event.utils';
import * as YAML from 'yaml';

declare type FileType = 'json' | 'yml';

@Component({
  selector: 'gramofo-export-graph',
  templateUrl: './export-graph.bottom-sheet.html',
  styleUrls: ['./export-graph.bottom-sheet.scss'],
})
export class ExportGraphBottomSheet {
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<ExportGraphBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private readonly graph: FOLGraph,
    private readonly clipboard: Clipboard,
    private readonly snackBarService: SnackBarService
  ) {}

  downloadGraph(event: MouseEvent, fileType: FileType): void {
    terminate(event);
    this.bottomSheetRef.dismiss();
    const cleansedGraph = this.cleanseGraph(this.graph);

    let fileContent = '';
    if (fileType === 'json') {
      fileContent = JSON.stringify(cleansedGraph, null, 2);
    } else if (fileType === 'yml') {
      fileContent = YAML.stringify(cleansedGraph);
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(fileContent));
    element.setAttribute('download', `${cleansedGraph.name}.${fileType}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  copyGraph(event: MouseEvent, fileType: FileType): void {
    terminate(event);
    this.bottomSheetRef.dismiss();
    const cleansedGraph = this.cleanseGraph(this.graph);

    let exportContent = '';
    if (fileType === 'json') {
      exportContent = JSON.stringify(cleansedGraph, null, 2);
    } else if (fileType === 'yml') {
      exportContent = YAML.stringify(cleansedGraph);
    }

    if (this.clipboard.copy(exportContent)) {
      this.snackBarService.openSnackBar({ key: 'export.copy-success' }, undefined, 2000);
    } else {
      this.snackBarService.openSnackBar({ key: 'export.copy-failure' }, undefined, 5000);
    }
  }

  private cleanseGraph(graph: FOLGraph): any {
    return {
      name: graph.name,
      description: graph.description,
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }
}
