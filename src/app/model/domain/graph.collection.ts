import { Params } from '@angular/router';
import copy from 'fast-copy';

import { FOLGraph } from './fol.graph';

export interface GraphCollection {
  [key: string]: FOLGraph;
}

export function setGraph(state: GraphCollection, graph: FOLGraph): GraphCollection {
  const newState = copy(state);
  newState[graph.name] = graph;
  return newState;
}

export function unsetGraph(state: GraphCollection, key: string): GraphCollection {
  const newState = copy(state);
  delete newState[key];
  return newState;
}

export const GRAPH_KEY = 'graphKey';
export const GRAPH_SOURCE = 'graphSource';
export type GraphSource = 'graphCache' | 'graphStore';

export function graphCollectionQueryParams(graphSource: GraphSource, graphKey: string): Params {
  return { graphSource, graphKey };
}
