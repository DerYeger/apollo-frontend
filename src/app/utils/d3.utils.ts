import { GraphConfiguration } from '../configurations/graph.configuration';
import { D3Node } from '../model/d3/d3.node';

export function paddedLinePath(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const sourceX = source.x! + graphConfiguration.nodeRadius * normX;
  const sourceY = source.y! + graphConfiguration.nodeRadius * normY;
  const targetX = target.x! - graphConfiguration.markerPadding * normX;
  const targetY = target.y! - graphConfiguration.markerPadding * normY;
  return `M${sourceX},${sourceY}
          L${targetX},${targetY}`;
}

export function arcPath(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const targetX = target.x! - graphConfiguration.markerPadding * normX;
  const targetY = target.y! - graphConfiguration.markerPadding * normY;
  return `M${source.x},${source.y}
          A${dist},${dist},0,0,1,${targetX},${targetY}`;
}

// TODO Implement proper reflexive links.
export function reflexivePath(node: D3Node, graphConfiguration: GraphConfiguration): string {
  const deltaX = 0;
  const deltaY = node.y! + graphConfiguration.nodeRadius - node.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const targetX = node.x! - graphConfiguration.markerPadding * normX;
  const targetY = node.y! - graphConfiguration.markerPadding * normY;
  return `M${node.x},${node.y}
          A${graphConfiguration.nodeRadius},${graphConfiguration.nodeRadius},0,1,0,${node.x},${targetY}`;
}

export function linePath(from: [number, number], to: [number, number]): string {
  return `M${from[0]},${from[1]}
          L${to[0]},${to[1]}`;
}

export function directLinkTextTransform(source: D3Node, target: D3Node): string {
  const xOffset = (source.x! + target.x!) / 2;
  const yOffset = (source.y! + target.y!) / 2;
  return `translate(${xOffset},${yOffset})`;
}

export function bidirectionalLinkTextTransform(source: D3Node, target: D3Node): string {
  const angle = Math.atan2(target.y! - source.y!, target.x! - source.x!);
  const xOffset = 35 * Math.cos(angle) + source.x!;
  const yOffset = 35 * Math.sin(angle) + source.y!;
  return `translate(${xOffset},${yOffset})`;
}

// TODO Implement proper reflexive links.
export function reflexiveLinkTextTransform(source: D3Node, target: D3Node): string {
  return bidirectionalLinkTextTransform(source, target);
}
