import { FOLEdge } from './fol.edge';
import { FOLNode } from './fol.node';

export interface FOLGraph {
  nodes: FOLNode[];
  edges: FOLEdge[];
}
