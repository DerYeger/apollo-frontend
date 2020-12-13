export interface GraphConfiguration {
  nodeBorder: number;
  nodeRadius: number;

  tooltipOpacity: number;
  tooltipFadeInTame: number;
  tooltipFadeOutTime: number;

  markerBoxSize: number;
  markerPadding: number;
  markerRef: number;
  arrowPoints: [number, number][];
  markerPath: string;
}

const nodeBorder = 2;
const nodeRadius = 20;

const tooltipOpacity = 0.9;
const tooltipFadeInTame = 500;
const tooltipFadeOutTime = 200;

const markerBoxSize = 4;

export const DEFAULT_GRAPH_CONFIGURATION: GraphConfiguration = {
  nodeBorder,
  nodeRadius,

  tooltipOpacity,
  tooltipFadeInTame,
  tooltipFadeOutTime,

  markerBoxSize,
  markerPadding: nodeRadius + nodeBorder + markerBoxSize,
  markerRef: markerBoxSize / 2,
  arrowPoints: [
    [0, 0],
    [0, markerBoxSize],
    [markerBoxSize, markerBoxSize / 2],
  ],
  markerPath: [0, 0, markerBoxSize, markerBoxSize].join(','),
};
