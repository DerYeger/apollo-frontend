import { FOLEdge } from 'src/app/model/domain/fol.edge';
import { FOLNode } from 'src/app/model/domain/fol.node';

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
