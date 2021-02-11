import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface FOLEntity {
  semantics: string;
  syntax: string;
}

const entities: FOLEntity[] = [
  { semantics: 'misc.true', syntax: 'tt' },
  { semantics: 'misc.false', syntax: 'ff' },
  { semantics: '∀', syntax: 'forall' },
  { semantics: '∃', syntax: 'exists' },
  { semantics: '¬', syntax: '!' },
  { semantics: '∨', syntax: '|, ||' },
  { semantics: '∧', syntax: '&, &&' },
  { semantics: '→', syntax: '->' },
  { semantics: '↔', syntax: '<->' },
  { semantics: '≐', syntax: '=' },
];

/**
 * Dialog that shows the semantics of the FOL formula syntax.
 */
@Component({
  templateUrl: './formula-syntax.dialog.html',
  styleUrls: ['./formula-syntax.dialog.scss'],
})
export class FormulaSyntaxDialog {
  public readonly columns: string[] = ['semantics', 'syntax'];

  public readonly dataSource = new MatTableDataSource<FOLEntity>(entities);
}
