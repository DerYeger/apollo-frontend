import * as d3 from 'd3';
import { D3ZoomEvent } from 'd3';

export type Zoom = d3.ZoomBehavior<SVGSVGElement, undefined>;

export function createZoom<E extends Element, D>(onZoom: (event: D3ZoomEvent<E, D>) => void): Zoom {
  return d3
    .zoom<SVGSVGElement, undefined>()
    .scaleExtent([0.33, 3])
    .filter((event) => event.button === 0 || event.touches?.length >= 2)
    .on('zoom', (event) => onZoom(event));
}
