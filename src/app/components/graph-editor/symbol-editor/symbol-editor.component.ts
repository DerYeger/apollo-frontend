import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { NGXLogger } from 'ngx-logger';

import { SymbolEditorConfiguration } from 'src/app/configurations/symbol-editor.configuration';

/**
 * Component for editing a set of symbols.
 * Title and validation are provided by the configuration.
 */
@Component({
  selector: 'apollo-symbol-editor[symbols][config]',
  templateUrl: './symbol-editor.component.html',
  styleUrls: ['./symbol-editor.component.scss'],
})
export class SymbolEditorComponent implements OnChanges {
  @Input() public symbols!: Set<string>;
  @Input() public config!: SymbolEditorConfiguration;

  @Output() public readonly symbolsUpdated = new EventEmitter();

  public formControl: UntypedFormControl = new UntypedFormControl('');

  public constructor(private readonly log: NGXLogger) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.config !== undefined) {
      this.formControl = new UntypedFormControl('', Validators.pattern(this.config.symbolPattern));
    }
  }

  public addSymbol(symbolAddedEvent: MatChipInputEvent): void {
    if (this.formControl.invalid) {
      return;
    }

    symbolAddedEvent.value
      .split(',')
      .map((symbol) => symbol.trim())
      .forEach((symbol) => {
        if (symbol.length >= 1) {
          this.log.debug(`Adding symbol ${symbol}.`);
          symbolAddedEvent.input.value = '';
          this.symbols.add(symbol);
          this.symbolsUpdated.emit();
        }
      });
  }

  public removeSymbol(symbol: string): void {
    this.log.debug(`Removing symbol ${symbol}.`);
    this.symbols.delete(symbol);
    this.symbolsUpdated.emit();
  }
}
