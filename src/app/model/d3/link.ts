import { SimulationLinkDatum } from 'd3';
import { Node } from './node';

export interface Link extends SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
  symbols: string[];
}
