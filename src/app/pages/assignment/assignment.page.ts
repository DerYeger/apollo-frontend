import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AssignmentSolutionDialog } from 'src/app/dialogs/assignment-solution/assignment-solution.dialog';
import { HttpProgressDialog } from 'src/app/dialogs/http-progress/http-progress.dialog';
import { ApiAssignmentSolution } from 'src/app/model/api/api-assignment-solution';
import { Assignment } from 'src/app/model/api/assignment';
import { AssignmentCheckResponse } from 'src/app/model/api/assignment-check-response';
import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
import D3Graph from 'src/app/model/d3/d3.graph';
import { BackendService } from 'src/app/services/backend.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { markAssignmentAsCompleted } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'apollo-assignment',
  templateUrl: './assignment.page.html',
  styleUrls: ['./assignment.page.scss'],
})
export class AssignmentPage {
  public readonly assignment: Observable<Assignment> = this.store.select('assignments').pipe(
    map((assignments) => assignments[this.slug]),
    tap((assignment) => {
      if (assignment === undefined) {
        this.router.navigateByUrl('/assignments');
      }
    }),
  );

  public readonly firstGraph = new D3Graph();
  public readonly firstGraph$ = of(this.firstGraph);

  public readonly secondGraph = new D3Graph();
  public readonly secondGraph$ = of(this.secondGraph);

  private readonly slug = this.route.snapshot.params.slug;

  public constructor(
    private readonly backendService: BackendService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly store: Store<State>,
  ) {}

  public submit() {
    firstValueFrom(this.assignment).then((assignment) => {
      const solution: ApiAssignmentSolution = {
        assignmentId: assignment.id,
        firstGraph: this.firstGraph.toDomainGraph(),
        secondGraph: this.secondGraph.toDomainGraph(),
      };
      this.checkSolution(solution);
    });
  }

  private checkSolution(solution: ApiAssignmentSolution) {
    const request = this.backendService.checkAssignmentSolution(solution);
    const requestDialog = this.dialog.open<HttpProgressDialog<ModelCheckerResponse>>(HttpProgressDialog, {
      width: '90%',
      data: request,
      autoFocus: false,
    });
    requestDialog
      .afterClosed()
      .pipe(filter((response) => response !== undefined))
      .subscribe((response: AssignmentCheckResponse) => {
        if (response.correct) {
          this.store.dispatch(markAssignmentAsCompleted({ key: solution.assignmentId }));
        }
        this.dialog.open(AssignmentSolutionDialog, {
          autoFocus: false,
          data: response,
          width: '50vw',
          minWidth: '250px',
          maxWidth: '750px',
        });
      });
  }
}
