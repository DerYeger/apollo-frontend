import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject, Subscription } from 'rxjs';
import { FOLLink } from 'src/app/model/d3/link';

@Component({
  selector: 'gramofo-link-form[link]',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent implements OnChanges, OnDestroy, OnInit {
  @Input() link!: FOLLink | null;

  private linkDeletionsSubscription$?: Subscription;
  @Input() linkDeletions$?: Observable<FOLLink>;

  private readonly deletionRequestsSubject$ = new Subject<FOLLink>();
  @Output() readonly deletionRequests$ = this.deletionRequestsSubject$.asObservable();

  readonly form: FormGroup;

  constructor(private readonly log: NGXLogger, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      symbols: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.linkDeletionsSubscription$ = this.linkDeletions$?.subscribe((deletedLink) => {
      if (this.link !== null && this.link.source.id === deletedLink.source.id && this.link.target.id === deletedLink.target.id) {
        this.log.debug(`Removing Link ${this.link.source.id}-${this.link.target.id}, because it has been deleted.`);
        this.link = null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newLink = changes.link.currentValue;
    if (newLink !== null) {
      this.log.debug(`Loading Link ${newLink.source.id}-${newLink.target.id}`);
    }
  }

  ngOnDestroy(): void {
    this.linkDeletionsSubscription$?.unsubscribe();
  }

  onSubmit(): void {
    if (this.link !== null) {
      const input = (this.form.get('symbols')?.value ?? '') as string;
      const symbols = input.split(',').map((s) => s.trim());
      this.log.debug(`Link ${this.link.source.id}-${this.link.target.id}: Setting symbols: ${symbols}`);
    }
  }

  onDelete(): void {
    if (this.link !== null) {
      const link = this.link;
      this.link = null;
      this.deletionRequestsSubject$.next(link);
    }
  }
}
