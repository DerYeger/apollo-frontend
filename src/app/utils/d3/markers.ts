import * as d3 from 'd3';

import { GraphConfiguration } from 'src/app/configurations/graph.configuration';
import { Canvas } from 'src/app/utils/d3/canvas';

export function initMarkers(canvas: Canvas, config: GraphConfiguration): void {
  createLinkMarker(canvas, config, 'link-arrow', 'arrow');
  createLinkMarker(canvas, config, 'draggable-link-arrow', 'arrow draggable');
}

function createLinkMarker(canvas: Canvas, config: GraphConfiguration, id: string, classes: string): void {
  canvas
    .append('defs')
    .append('marker')
    .attr('id', id)
    .attr('viewBox', config.markerPath)
    .attr('refX', config.markerRef)
    .attr('refY', config.markerRef)
    .attr('markerWidth', config.markerBoxSize)
    .attr('markerHeight', config.markerBoxSize)
    .attr('orient', 'auto')
    .classed(classes, true)
    .append('path')
    .attr('d', `${d3.line()(config.arrowPoints)}`);
}
