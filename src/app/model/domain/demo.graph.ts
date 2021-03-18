import { FOLGraph } from 'src/app/model/domain/fol.graph';

export const DEMO_GRAPH: FOLGraph = {
  name: 'Demo Graph',
  description: 'A simple demonstration Graph.',
  lastEdit: Date.now(),
  nodes: [
    { name: '0', relations: [], constants: ['a', 'b'] },
    { name: '1', relations: [], constants: ['c'] },
    { name: '2', relations: [], constants: ['d'] },
    { name: '3', relations: [], constants: ['e', 'f'] },
  ],
  edges: [
    { source: '0', target: '0', relations: ['R'], functions: [] },
    { source: '0', target: '1', relations: ['A'], functions: [] },
    { source: '1', target: '2', relations: ['B'], functions: [] },
    { source: '2', target: '1', relations: ['B'], functions: [] },
  ],
};
