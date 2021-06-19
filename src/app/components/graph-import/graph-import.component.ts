import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as YAML from 'yaml';

import D3Graph from 'src/app/model/d3/d3.graph';
import { DEMO_GRAPH } from 'src/app/model/domain/demo.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { terminate } from 'src/app/utils/events';

/**
 * Allows importing graphs as text or by uploading files.
 * Supports both JSON and YAML.
 */
@Component({
  selector: 'gramofo-graph-import',
  templateUrl: './graph-import.component.html',
  styleUrls: ['./graph-import.component.scss'],
})
export class GraphImportComponent implements AfterViewInit {
  @Output() public readonly graphImport = new EventEmitter<FOLGraph>();

  @ViewChild('textInput') private readonly textInput!: ElementRef<HTMLInputElement>;

  @ViewChild('fileInput') private readonly fileInput!: ElementRef<HTMLInputElement>;

  public readonly textInputFormControl = new FormControl('');

  public constructor(private readonly snackBarService: SnackBarService) {}

  public ngAfterViewInit(): void {
    this.textInput.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
      const inputElement = this.textInput.nativeElement;
      if (event.key === 'Tab') {
        terminate(event);
        const start = inputElement.selectionStart ?? 0;
        const end = inputElement.selectionEnd ?? 0;
        inputElement.value = inputElement.value.substring(0, start) + '\t' + inputElement.value.substring(end);
        inputElement.selectionStart = inputElement.selectionEnd = start + 1;
      }
    });
  }

  public onPaste(event: ClipboardEvent): void {
    this.handleTextInput(event.clipboardData?.getData('text') ?? '');
  }

  public triggerFileImport(): void {
    this.fileInput.nativeElement.click();
  }

  public onFileInput(): void {
    const files: FileList | null = this.fileInput.nativeElement.files;
    if (files === null || files.length < 1) {
      this.snackBarService.openSnackBar({ key: 'import.file-error' }, undefined, 10000);
    } else {
      files[0].text().then((fileContent) => this.handleTextInput(fileContent));
    }
    this.fileInput.nativeElement.value = '';
  }

  public handleTextInput(textInput: string = this.textInputFormControl.value): void {
    try {
      // YAML::parse also works with JSON.
      const parsedGraph: FOLGraph = YAML.parse(textInput);
      D3Graph.fromDomainGraph(parsedGraph)
        .then(() => this.graphImport.emit(parsedGraph))
        .catch((error) => {
          if (error.key !== undefined) {
            this.snackBarService.openSnackBar(error, undefined);
          } else {
            this.snackBarService.openSnackBar({ key: 'validation.parse-error' }, undefined, 10000);
          }
        });
    } catch (error) {
      this.snackBarService.openSnackBar({ key: 'validation.parse-error' }, undefined, 10000);
    }
  }
  public loadDemoGraph(): void {
    this.graphImport.emit(DEMO_GRAPH);
  }
}
