import { Feedback } from './model-checker-request';
import { ModelCheckerTrace } from './model-checker-trace';

/**
 * API response of the ModelChecking algorithm.
 */
export interface ModelCheckerResponse {
  rootTrace: ModelCheckerTrace;
  feedback: Feedback;
}
