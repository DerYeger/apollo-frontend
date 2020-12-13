import { SimulationLinkDatum } from 'd3';
import { FOLNode } from './node';

export interface FOLLink extends SimulationLinkDatum<FOLNode> {
  source: FOLNode;
  target: FOLNode;
  relations: Set<string>;
  functions: Set<string>;
}

export class GramoFOLink implements FOLLink {
  readonly relations = new Set<string>();
  readonly functions = new Set<string>();

  constructor(readonly source: FOLNode, readonly target: FOLNode, initialRelations?: string[], initialFunctions?: string[]) {
    initialRelations?.forEach((relation) => this.relations.add(relation));
    initialFunctions?.forEach((functions) => this.functions.add(functions));
  }
}
