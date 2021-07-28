import { Component, Input, OnInit } from '@angular/core';

import { Assignment } from 'src/app/model/api/assignment';

const maxShortenedDescriptionLength = 100;

@Component({
  selector: 'apollo-assignment-card[assignment]',
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.scss'],
})
export class AssignmentCardComponent implements OnInit {
  @Input()
  public assignment!: Assignment;

  public shortenedDescription?: string;

  public ngOnInit(): void {
    const description = this.assignment.description;
    if (description === undefined) {
      return;
    }

    if (description.length <= maxShortenedDescriptionLength) {
      this.shortenedDescription = description;
      return;
    }

    this.shortenedDescription = description.substring(0, maxShortenedDescriptionLength - 3).concat('...');
  }
}
