import { Params } from '@angular/router';
import copy from 'fast-copy';

import { FOLGraph } from 'src/app/model/domain/fol.graph';

/**
 * Collection of graphs, associated by their names.
 */
export interface GraphCollection {
  [key: string]: FOLGraph;
}

/**
 * Adds a graph to the specified collection.
 *
 * @param state The target collection.
 * @param graph The graph to be added.
 */
export function setGraph(state: GraphCollection, graph: FOLGraph): GraphCollection {
  const newState = copy(state);
  newState[graph.name] = graph;
  return newState;
}

/**
 * Removes a graph from the specified collection.
 *
 * @param state The source collection.
 * @param key The name of the graph to be removed.
 */
export function unsetGraph(state: GraphCollection, key: string): GraphCollection {
  const newState = copy(state);
  delete newState[key];
  return newState;
}

export const GRAPH_KEY = 'graphKey';
export const GRAPH_SOURCE = 'graphSource';
export type GraphSource = 'graphCache' | 'graphStore';

/**
 * Creates queryParams that allow extraction of the graph with the given name from the specified source.
 *
 * @param graphSource Source of the graph.
 * @param graphKey Name of the graph.
 */
export function graphCollectionQueryParams(graphSource: GraphSource, graphKey: string): Params {
  return { graphSource, graphKey };
}
