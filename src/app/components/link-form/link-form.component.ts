import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { Link } from 'src/app/model/d3/link';

@Component({
  selector: 'gramofo-link-form[link]',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent implements OnChanges {
  @Input() link!: Link | null;

  private readonly deletionRequestSubject$ = new Subject<Link>();
  @Output() readonly deletionRequests$ = this.deletionRequestSubject$.asObservable();

  readonly form: FormGroup;

  constructor(private readonly log: NGXLogger, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      symbols: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newLink = changes.link.currentValue;
    if (newLink !== null) {
      this.log.debug(`Loading Link ${newLink.source.id}-${newLink.target.id}`);
      this.form.get('symbols')?.setValue(newLink.symbols.join(', '));
    }
  }

  onSubmit(): void {
    if (this.link !== null) {
      const input = (this.form.get('symbols')?.value ?? '') as string;
      const symbols = input.split(',').map((s) => s.trim());
      this.log.debug(`Link ${this.link.source.id}-${this.link.target.id}: Setting symbols: ${symbols}`);
      this.link.symbols = symbols;
    }
  }

  onDelete(): void {
    if (this.link !== null) {
      const link = this.link;
      this.link = null;
      this.deletionRequestSubject$.next(link);
    }
  }
}
