import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { Node } from 'src/app/model/d3/node';

@Component({
  selector: 'gramofo-node-form[node]',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss'],
})
export class NodeFormComponent implements OnChanges {
  @Input() node!: Node | null;

  private readonly deletionRequestSubject$ = new Subject<Node>();
  @Output() readonly deletionRequests$ = this.deletionRequestSubject$.asObservable();

  readonly form: FormGroup;

  constructor(private readonly log: NGXLogger, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      symbols: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newNode = changes.node.currentValue;
    if (newNode !== null) {
      this.log.debug(`Loading Node ${newNode.id}`);
      this.form.get('symbols')?.setValue(newNode.symbols.join(', '));
    }
  }

  onSubmit(): void {
    if (this.node !== null) {
      const input = (this.form.get('symbols')?.value ?? '') as string;
      const symbols = input.split(',').map((s) => s.trim());
      this.log.debug(`Node ${this.node.id}: Setting symbols: ${symbols}`);
      this.node.symbols = symbols;
    }
  }

  onDelete(): void {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      this.deletionRequestSubject$.next(node);
    }
  }
}
