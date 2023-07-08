import * as d3 from 'd3';
import { D3DragEvent } from 'd3';

import { D3Node } from 'src/app/model/d3/d3.node';

export type Drag = d3.DragBehavior<SVGGElement, D3Node, D3Node>;

export type NodeDragEvent = D3DragEvent<SVGCircleElement, D3Node, D3Node>;

export function createDrag(
  onDragStart: (event: NodeDragEvent, d: D3Node) => void,
  onDrag: (event: NodeDragEvent, d: D3Node) => void,
  onDragEnd: (event: NodeDragEvent, d: D3Node) => void,
): Drag {
  return d3
    .drag<SVGGElement, D3Node, D3Node>()
    .filter((event) => event.button === 1)
    .on('start', onDragStart)
    .on('drag', onDrag)
    .on('end', onDragEnd);
}
