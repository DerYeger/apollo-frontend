import { FOLEdge } from './fol.edge';
import { FOLNode } from './fol.node';

export interface FOLGraph {
  name: string;
  description: string;
  lastEdit: number;
  nodes: FOLNode[];
  edges: FOLEdge[];
}
