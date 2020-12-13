import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { NGXLogger } from 'ngx-logger';
import { SymbolEditorConfiguration } from 'src/app/configurations/symbol-editor.configuration';

@Component({
  selector: 'gramofo-symbol-editor[symbols][config]',
  templateUrl: './symbol-editor.component.html',
  styleUrls: ['./symbol-editor.component.scss'],
})
export class SymbolEditorComponent {
  @Input() symbols!: Set<string>;
  @Input() config!: SymbolEditorConfiguration;

  @Output() readonly symbolsUpdated = new EventEmitter();

  constructor(private readonly log: NGXLogger) {}

  addSymbol(symbolAddedEvent: MatChipInputEvent): void {
    const symbol = symbolAddedEvent.value.trim();
    if (symbol.length >= 1) {
      this.log.debug(`Adding symbol ${symbol}.`);
      symbolAddedEvent.input.value = '';
      this.symbols.add(symbol);
      this.symbolsUpdated.emit();
    }
  }

  removeSymbol(symbol: string): void {
    this.log.debug(`Removing symbol ${symbol}.`);
    this.symbols.delete(symbol);
    this.symbolsUpdated.emit();
  }
}
