import { graphConfiguration as gc } from '../configurations/graph.configuration';
import { Node } from '../model/d3/node';

export function directPath(source: Node, target: Node): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const sourceX = source.x! + (gc.nodeRadius * normX);
  const sourceY = source.y! + (gc.nodeRadius * normY);
  const targetX = target.x! - (gc.markerPadding * normX);
  const targetY = target.y! - (gc.markerPadding * normY);
  return `M${sourceX},${sourceY}
          L${targetX},${targetY}`;
}

export function arcPath(source: Node, target: Node): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const targetX = target.x! - (gc.markerPadding * normX);
  const targetY = target.y! - (gc.markerPadding * normY);
  return `M${source.x},${source.y}
          A${dist},${dist},0,0,1,${targetX},${targetY}`;
}

export function reflexivePath(node: Node): string {
  const deltaX = 0;
  const deltaY = node.y! + gc.nodeRadius - node.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const targetX = node.x! - (gc.markerPadding * normX);
  const targetY = node.y! - (gc.markerPadding * normY);
  return `M${node.x},${node.y}
          A${gc.nodeRadius},${gc.nodeRadius},0,1,0,${node.x},${targetY}`;
}

export function linePath(from: [number, number], to: [number, number]): string {
  return `M${from[0]},${from[1]}
          L${to[0]},${to[1]}`;
}
