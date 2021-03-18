import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { Language } from 'src/app/store/state';

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
