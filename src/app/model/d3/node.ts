import { SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
  id: string;
  symbols: string[];
}
