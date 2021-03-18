import { Feedback } from 'src/app/model/api/model-checker-request';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

/**
 * API response of the ModelChecking algorithm.
 */
export interface ModelCheckerResponse {
  rootTrace: ModelCheckerTrace;
  feedback: Feedback;
}
