import { Language } from 'src/app/store/state';

import { FOLGraph } from '../domain/fol.graph';

export interface ModelCheckerRequest {
  formula: string;
  graph: FOLGraph;
  language: Language;
}
