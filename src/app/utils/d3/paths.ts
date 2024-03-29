import { Matrix } from 'ml-matrix';

import { GraphConfiguration } from 'src/app/configurations/graph.configuration';
import { D3Node } from 'src/app/model/d3/d3.node';

/**
 * Creates the path of a straight line between the edges of two nodes.
 *
 * @param source The source D3Node.
 * @param target The target D3Node.
 * @param graphConfiguration Visual configuration.
 */
export function paddedLinePath(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const deltaX = target.x! - source.x!;
  const deltaY = target.y! - source.y!;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;
  const sourceX = source.x! + (graphConfiguration.nodeRadius - 1) * normX;
  const sourceY = source.y! + (graphConfiguration.nodeRadius - 1) * normY;
  const targetX = target.x! - graphConfiguration.markerPadding * normX;
  const targetY = target.y! - graphConfiguration.markerPadding * normY;
  return `M${sourceX},${sourceY}
          L${targetX},${targetY}`;
}

/**
 * Creates the path of an arc line between the edges of two nodes.
 *
 * @param source The source D3Node.
 * @param target The target D3Node.
 * @param graphConfiguration Visual configuration.
 */
export function paddedArcPath(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const s = new Matrix([[source.x!, source.y!]]);
  const t = new Matrix([[target.x!, target.y!]]);
  const diff = Matrix.subtract(t, s);
  const dist = diff.norm('frobenius');
  const norm = diff.divide(dist);
  const rotation = degreesToRadians(10);
  const start = rotate(norm, -rotation)
    .multiply(graphConfiguration.nodeRadius - 1)
    .add(s);
  const endNorm = Matrix.multiply(norm, -1);
  const end = rotate(endNorm, rotation)
    .multiply(graphConfiguration.nodeRadius)
    .add(t)
    .add(rotate(endNorm, rotation).multiply(2 * graphConfiguration.markerBoxSize));
  const arcRadius = 1.2 * dist;
  return `M${start.get(0, 0)},${start.get(0, 1)}
          A${arcRadius},${arcRadius},0,0,1,${end.get(0, 0)},${end.get(0, 1)}`;
}

/**
 * Creates the path of a reflexive line of a node.
 * It will be always be directed away from the center.
 *
 * @param node The D3Node.
 * @param center The center point of the graph.
 * @param graphConfiguration Visual configuration.
 */
export function paddedReflexivePath(node: D3Node, center: [number, number], graphConfiguration: GraphConfiguration): string {
  const n = new Matrix([[node.x!, node.y!]]);
  const c = new Matrix([center]);
  if (n.get(0, 0) === c.get(0, 0) && n.get(0, 1) === c.get(0, 1)) {
    c.add([[0, 1]]); // Nodes at the exact center of the Graph should have their reflexive edge above them.
  }
  const diff = Matrix.subtract(n, c);
  const norm = diff.divide(diff.norm('frobenius'));
  const rotation = degreesToRadians(40);
  const start = rotate(norm, rotation)
    .multiply(graphConfiguration.nodeRadius - 1)
    .add(n);
  const end = rotate(norm, -rotation)
    .multiply(graphConfiguration.nodeRadius)
    .add(n)
    .add(rotate(norm, -rotation).multiply(2 * graphConfiguration.markerBoxSize));
  return `M${start.get(0, 0)},${start.get(0, 1)}
          A${graphConfiguration.nodeRadius},${graphConfiguration.nodeRadius},0,1,0,${end.get(0, 0)},${end.get(0, 1)}`;
}

/**
 * Creates a straight path between two points.
 *
 * @param from Source coordinates.
 * @param to Target coordinates.
 */
export function linePath(from: [number, number], to: [number, number]): string {
  return `M${from[0]},${from[1]}
          L${to[0]},${to[1]}`;
}

/**
 * Calculates the offset for the text of a mono-directional link.
 *
 * @param source The source D3Node.
 * @param target The target D3Node.
 */
export function directLinkTextTransform(source: D3Node, target: D3Node): string {
  const xOffset = (source.x! + target.x!) / 2;
  const yOffset = (source.y! + target.y!) / 2;
  return `translate(${xOffset},${yOffset - 8})`;
}

/**
 * Calculates the offset for the text of a bi-directional link.
 *
 * @param source The source D3Node.
 * @param target The target D3Node.
 * @param graphConfiguration Visual configuration.
 */
export function bidirectionalLinkTextTransform(source: D3Node, target: D3Node, graphConfiguration: GraphConfiguration): string {
  const s = new Matrix([[source.x!, source.y!]]);
  const t = new Matrix([[target.x!, target.y!]]);
  const diff = Matrix.subtract(t, s);
  const dist = diff.norm('frobenius');
  const norm = diff.divide(dist);
  const rotation = degreesToRadians(10);
  const endNorm = Matrix.multiply(norm, -1);
  const translation = 0.3 * dist > 2 * graphConfiguration.nodeRadius ? 0.3 * dist : 2 * graphConfiguration.nodeRadius;
  const end = rotate(endNorm, rotation).multiply(translation).add(t);
  return `translate(${end.get(0, 0)},${end.get(0, 1)})`;
}

/**
 *  Calculates the offset for the text of a reflexive link.
 *
 * @param node The D3Node.
 * @param center The center point of the graph.
 * @param graphConfiguration Visual configuration.
 */
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

/**
 * Calculates the radian value for the given degrees.
 *
 * @param degrees The degrees.
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Rotates a vector by the given radians around the origin.
 *
 * @param vector The vector to be rotated.
 * @param radians The radians to rotate the vector by.
 */
function rotate(vector: Matrix, radians: number): Matrix {
  const x = vector.get(0, 0);
  const y = vector.get(0, 1);
  return new Matrix([[x * Math.cos(radians) - y * Math.sin(radians), x * Math.sin(radians) + y * Math.cos(radians)]]);
}
