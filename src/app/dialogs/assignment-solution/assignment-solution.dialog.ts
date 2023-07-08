import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

import { ResultTreeDialog } from 'src/app/dialogs/result-tree/result-tree.dialog';
import { AssignmentCheckResponse } from 'src/app/model/api/assignment-check-response';
import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

@Component({
  selector: 'apollo-assignment-solution',
  templateUrl: './assignment-solution.dialog.html',
  styleUrls: ['./assignment-solution.dialog.scss'],
})
export class AssignmentSolutionDialog {
  public constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<AssignmentSolutionDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly result: AssignmentCheckResponse,
    private readonly router: Router,
  ) {}

  public showResultTreeDialog(trace: ModelCheckerTrace) {
    const result: ModelCheckerResponse = {
      rootTrace: trace,
      feedback: 'relevant',
    };
    this.dialog.open(ResultTreeDialog, {
      data: result,
    });
  }

  public navigateToOverview() {
    this.dialogRef.close();
    this.router.navigateByUrl('/assignments');
  }
}
