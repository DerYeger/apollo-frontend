import { Feedback } from './model-checker-request';
import { ModelCheckerTrace } from './model-checker-trace';

export interface ModelCheckerResponse {
  rootTrace: ModelCheckerTrace;
  feedback: Feedback;
}
