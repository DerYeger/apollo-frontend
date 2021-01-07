import { ModelCheckerTrace } from './model-checker-trace';

export interface ModelCheckerResponse {
  rootTrace: ModelCheckerTrace;
  isMinimized: boolean;
}
