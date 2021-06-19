import { Component, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Feedback } from 'src/app/model/api/model-checker-request';
import { setSelectedFeedback } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

interface FeedbackOption {
  feedback: Feedback;
  name: string; // Translation key for button text.
  description: string; // Translation key for info-tooltip.
}

const feedbackOptions: FeedbackOption[] = [
  {
    feedback: 'full',
    name: 'feedback.full.name',
    description: 'feedback.full.description',
  },
  {
    feedback: 'relevant',
    name: 'feedback.relevant.name',
    description: 'feedback.relevant.description',
  },
  {
    feedback: 'minimal',
    name: 'feedback.minimal.name',
    description: 'feedback.minimal.description',
  },
];

/**
 * Drop-down input for selecting the feedback-level of a ModelChecking request.
 * Persists the selection throughout refreshed.
 */
@Component({
  selector: 'apollo-feedback-selection',
  templateUrl: './feedback-selection.component.html',
  styleUrls: ['./feedback-selection.component.scss'],
})
export class FeedbackSelectionComponent {
  @ViewChild('selectionInput') private readonly selectionInput!: MatSelect;

  public readonly feedbackOptions = feedbackOptions;

  public readonly selectedFeedback$ = this.store.select('settings').pipe(map((settings) => settings.selectedFeedback));

  public get selectedFeedback(): Feedback {
    return this.selectionInput.value;
  }

  public constructor(private readonly store: Store<State>) {}

  public onSelectionChange(change: MatSelectChange): void {
    this.store.dispatch(setSelectedFeedback({ feedback: change.value }));
  }
}
