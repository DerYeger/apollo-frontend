import { FOLEdge } from './fol.edge';
import { FOLNode } from './fol.node';

export interface FOLGraph {
  name: string;
  nodes: FOLNode[];
  edges: FOLEdge[];
}
