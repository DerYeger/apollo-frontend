import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { terminate } from 'src/app/utils/event.utils';
import * as YAML from 'yaml';

type FileType = 'json' | 'yml';

@Component({
  selector: 'gramofo-export-graph',
  templateUrl: './export-graph.bottom-sheet.html',
  styleUrls: ['./export-graph.bottom-sheet.scss'],
})
export class ExportGraphBottomSheet {
  public constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<ExportGraphBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private readonly graph: FOLGraph,
    private readonly clipboard: Clipboard,
    private readonly snackBarService: SnackBarService
  ) {}

  public downloadGraph(event: MouseEvent, fileType: FileType): void {
    terminate(event);
    this.bottomSheetRef.dismiss();
    const sanitizedGraph = this.sanitizeGraph(this.graph);

    let fileContent = '';
    if (fileType === 'json') {
      fileContent = JSON.stringify(sanitizedGraph, null, 2);
    } else if (fileType === 'yml') {
      fileContent = YAML.stringify(sanitizedGraph);
    }

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/${fileType};charset=UTF-8,` + encodeURIComponent(fileContent));
    element.setAttribute('download', `${sanitizedGraph.name}.${fileType}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public copyGraph(event: MouseEvent, fileType: FileType): void {
    terminate(event);
    this.bottomSheetRef.dismiss();
    const sanitizedGraph = this.sanitizeGraph(this.graph);

    let exportContent = '';
    if (fileType === 'json') {
      exportContent = JSON.stringify(sanitizedGraph, null, 2);
    } else if (fileType === 'yml') {
      exportContent = YAML.stringify(sanitizedGraph);
    }

    if (this.clipboard.copy(exportContent)) {
      this.snackBarService.openSnackBar({ key: 'export.copy-success' });
    } else {
      this.snackBarService.openSnackBar({ key: 'export.copy-failure' }, undefined, 5000);
    }
  }

  private sanitizeGraph(graph: FOLGraph): any {
    return {
      name: graph.name,
      description: graph.description,
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }
}
