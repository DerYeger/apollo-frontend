import { Component, Input, OnInit } from '@angular/core';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

@Component({
  selector: 'gramofo-trace[trace]',
  templateUrl: './trace.component.html',
  styleUrls: ['./trace.component.scss']
})
export class TraceComponent {
  @Input() public trace!: ModelCheckerTrace;
}
