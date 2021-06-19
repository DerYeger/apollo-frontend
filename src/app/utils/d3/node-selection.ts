import * as d3 from 'd3';

import { D3Node } from 'src/app/model/d3/d3.node';
import { Canvas } from 'src/app/utils/d3/canvas';

export type NodeSelection = d3.Selection<SVGGElement, D3Node, SVGGElement, undefined>;

export function createNodeSelection(canvas: Canvas): NodeSelection {
  return canvas.append('g').classed('nodes', true).selectAll('circle');
}
