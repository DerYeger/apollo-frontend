import { Matrix } from 'ml-matrix';

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

export function paddedArcPath(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const targetX = target.x! - (graphConfiguration.markerPadding - 1) * normX;
  const targetY = target.y! - (graphConfiguration.markerPadding - 1) * normY;
  return `M${source.x},${source.y}
          A${dist},${dist},0,0,1,${targetX},${targetY}`;
}

export function paddedReflexivePath(node: D3Node, center: [number, number], graphConfiguration: GraphConfiguration): string {
  const n = new Matrix([[node.x!, node.y!]]);
  const c = new Matrix([center]);
  if (n.get(0, 0) === c.get(0, 0) && n.get(0, 1) === c.get(0, 1)) {
    c.add([[0, 1]]); // Nodes at the exact center of the Graph should have their reflexive edge above them.
  }
  const diff = Matrix.subtract(n, c);
  const norm = diff.divide(diff.norm('frobenius'));
  const rotation = 40 * (Math.PI / 180);
  const start = rotate(norm, rotation).multiply(graphConfiguration.nodeRadius).add(n);
  const end = rotate(norm, -rotation)
    .multiply(graphConfiguration.nodeRadius)
    .add(n)
    .add(rotate(norm, -rotation).multiply(2 * graphConfiguration.markerBoxSize));
  return `M${start.get(0, 0)},${start.get(0, 1)}
          A${graphConfiguration.nodeRadius},${graphConfiguration.nodeRadius},0,1,0,${end.get(0, 0)},${end.get(0, 1)}`;
}

function rotate(vector: Matrix, radians: number): Matrix {
  const x = vector.get(0, 0);
  const y = vector.get(0, 1);
  return new Matrix([[x * Math.cos(radians) - y * Math.sin(radians), x * Math.sin(radians) + y * Math.cos(radians)]]);
}

export function linePath(from: [number, number], to: [number, number]): string {
  return `M${from[0]},${from[1]}
          L${to[0]},${to[1]}`;
}

export function directLinkTextTransform(source: D3Node, target: D3Node): string {
  const xOffset = (source.x! + target.x!) / 2;
  const yOffset = (source.y! + target.y!) / 2;
  return `translate(${xOffset},${yOffset - 8})`;
}

export function bidirectionalLinkTextTransform(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const angle = Math.atan2(source.y! - target.y!, source.x! - target.x!);
  const xOffset = 2 * graphConfiguration.nodeRadius * Math.cos(angle) + target.x!;
  const yOffset = 2 * graphConfiguration.nodeRadius * Math.sin(angle) + target.y!;
  return `translate(${xOffset},${yOffset})`;
}

export function reflexiveLinkTextTransform(node: D3Node, center: [number, number], graphConfiguration: GraphConfiguration): string {
  const n = new Matrix([[node.x!, node.y!]]);
  const c = new Matrix([center]);
  if (n.get(0, 0) === c.get(0, 0) && n.get(0, 1) === c.get(0, 1)) {
    c.add([[0, 1]]); // Nodes at the exact center of the Graph should have their reflexive edge above them.
  }
  const diff = Matrix.subtract(n, c);
  const offset = diff
    .divide(diff.norm('frobenius'))
    .multiply(3 * graphConfiguration.nodeRadius + 8)
    .add(n);
  return `translate(${offset.get(0, 0)},${offset.get(0, 1)})`;
}
