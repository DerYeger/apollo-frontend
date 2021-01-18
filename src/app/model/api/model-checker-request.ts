import { Language } from 'src/app/store/state';

import { FOLGraph } from '../domain/fol.graph';

/**
 * Feedback level of the ModelChecking algorithm.
 * 'full' includes redundant checks.
 * 'minimal' only includes the result.
 */
export type Feedback = 'full' | 'relevant' | 'minimal';

/**
 * API request for the ModelChecking algorithm.
 */
export interface ModelCheckerRequest {
  formula: string;
  graph: FOLGraph;
  language: Language;
  feedback: Feedback;
}
