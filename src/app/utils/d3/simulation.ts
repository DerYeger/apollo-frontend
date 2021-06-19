import * as d3 from 'd3';

import { GraphConfiguration } from 'src/app/configurations/graph.configuration';
import D3Graph from 'src/app/model/d3/d3.graph';
import { D3Link } from 'src/app/model/d3/d3.link';
import { D3Node } from 'src/app/model/d3/d3.node';

export type Simulation = d3.Simulation<D3Node, D3Link>;

export function createSimulation(graph: D3Graph, config: GraphConfiguration, width: number, height: number, useForces: boolean, onTick: () => void): Simulation {
  const simulation = d3.forceSimulation<D3Node, D3Link>(graph!.nodes).on('tick', () => onTick());
  if (useForces) {
    simulation
      .force('charge', d3.forceManyBody<D3Node>().strength(-500))
      .force('collision', d3.forceCollide<D3Node>().radius(config.nodeRadius))
      .force(
        'link',
        d3
          .forceLink<D3Node, D3Link>()
          .links(graph!.links)
          .id((d: D3Node) => d.id)
          .distance(config.nodeRadius * 10)
      )
      .force('x', d3.forceX<D3Node>(width / 2).strength(0.05))
      .force('y', d3.forceY<D3Node>(height / 2).strength(0.05));
  }
  return simulation;
}
