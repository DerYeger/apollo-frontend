import { SimulationLinkDatum } from 'd3';

import { D3Node } from 'src/app/model/d3/d3.node';

/**
 * Link (edge) interface with D3.js compatability.
 * Required for strict type-checking.
 */
export interface D3Link extends SimulationLinkDatum<D3Node> {
  source: D3Node;
  target: D3Node;
  relations: Set<string>;
  functions: Set<string>;
}

/**
 * Link (edge) class with D3.js compatability.
 */
export class ApolloLink implements D3Link {
  public readonly relations = new Set<string>();
  public readonly functions = new Set<string>();

  public constructor(
    public readonly source: D3Node,
    public readonly target: D3Node,
    initialRelations?: string[],
    initialFunctions?: string[],
  ) {
    initialRelations?.forEach((relation) => this.relations.add(relation));
    initialFunctions?.forEach((functions) => this.functions.add(functions));
  }
}
