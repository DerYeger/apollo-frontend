import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { terminate } from 'src/app/utils/event.utils';
import * as YAML from 'yaml';

type FileType = 'json' | 'yml';

/**
 * BottomSheet for exporting graphs.
 * Allows exporting as files or by copying to the clipboard.
 * Supports JSON and YAML.
 */
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

  /**
   * Downloads the graph as a file by creating a hidden link and performing a click on it.
   *
   * @param event Source event. Will be terminated.
   * @param fileType Type of the file to be downloaded.
   */
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

  /**
   * Copies the graph to the clipboard and shows a confirmation SnackBar.
   *
   * @param event Source event. Will be terminated.
   * @param fileType Format that will be copied.
   */
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

  /**
   * Removed internal fields from a graph.
   *
   * @param graph The graph that will be sanitized.
   */
  private sanitizeGraph(graph: FOLGraph): any {
    return {
      name: graph.name,
      description: graph.description,
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }
}
