import * as d3 from 'd3';

import { D3Link } from 'src/app/model/d3/d3.link';
import { Canvas } from 'src/app/utils/d3/canvas';

export type LinkSelection = d3.Selection<SVGGElement, D3Link, SVGGElement, undefined>;

export function createLinkSelection(canvas: Canvas): LinkSelection {
  return canvas.append('g').classed('links', true).selectAll('path');
}
