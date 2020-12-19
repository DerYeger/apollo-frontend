import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import D3Graph from 'src/app/model/d3/d3.graph';
import { DEMO_GRAPH } from 'src/app/model/domain/demo.graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { terminate } from 'src/app/utils/event.utils';
import * as YAML from 'yaml';

@Component({
  selector: 'gramofo-graph-import',
  templateUrl: './graph-import.component.html',
  styleUrls: ['./graph-import.component.scss'],
})
export class GraphImportComponent implements AfterViewInit {
  public readonly textInputFormControl = new FormControl('');

  @ViewChild('textInput')
  private readonly textInput!: ElementRef<HTMLInputElement>;

  @ViewChild('fileInput')
  private readonly fileInput!: ElementRef<HTMLInputElement>;

  @Output() public readonly graphImport = new EventEmitter<FOLGraph>();

  constructor(private readonly snackBarService: SnackBarService) {}

  ngAfterViewInit(): void {
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
      this.snackBarService.openSnackBar({ key: 'import.file-error' });
    } else {
      files[0].text().then((fileContent) => this.handleTextInput(fileContent));
    }
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
            this.snackBarService.openSnackBar({ key: 'validation.parse-error' });
          }
        });
    } catch (error) {
      this.snackBarService.openSnackBar({ key: 'validation.parse-error' });
    }
  }
  public loadDemoGraph(): void {
    this.graphImport.emit(DEMO_GRAPH);
  }
}
