import { FOLEdge } from './fol.edge';
import { FOLNode } from './fol.node';

/**
 * FOL structure in graph form.
 * Serializable.
 */
export interface FOLGraph {
  name: string;
  description: string;
  lastEdit: number;
  nodes: FOLNode[];
  edges: FOLEdge[];
}
