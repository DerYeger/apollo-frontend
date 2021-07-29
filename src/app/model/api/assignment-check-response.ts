import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

export interface AssignmentCheckResponse {
  correct: boolean;
  firstTrace?: ModelCheckerTrace;
  secondTrace?: ModelCheckerTrace;
}
