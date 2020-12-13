import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { D3DragEvent, D3ZoomEvent } from 'd3';
import { GraphConfiguration, DEFAULT_GRAPH_CONFIGURATION } from 'src/app/configurations/graph.configuration';
import Graph from 'src/app/model/d3/graph';
import { FOLLink } from 'src/app/model/d3/link';
import { FOLNode } from 'src/app/model/d3/node';
import { arcPath, directPath, linePath, reflexivePath } from 'src/app/utils/d3.utils';
import { terminate } from 'src/app/utils/event.utils';

@Component({
  selector: 'gramofo-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit {
  @Input() graph = new Graph();
  @Input() isEditMode = true;
  @Input() config: GraphConfiguration = DEFAULT_GRAPH_CONFIGURATION;

  @Output() readonly linkSelected = new EventEmitter<FOLLink>();
  @Output() readonly nodeSelected = new EventEmitter<FOLNode>();

  @Output() readonly linkDeleted = new EventEmitter<FOLLink>();
  @Output() readonly nodeDeleted = new EventEmitter<FOLNode>();

  private lastNodeId = 0;

  private width = 0;
  private height = 0;

  private xOffset = 0;
  private yOffset = 0;

  @ViewChild('graphHost')
  readonly graphHost!: ElementRef<any>;

  @ViewChild('tooltip')
  readonly tooltip!: ElementRef<any>;
  private canShowTooltip = true;

  private simulation?: d3.Simulation<FOLNode, FOLLink>;

  private canvas?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private link?: d3.Selection<SVGPathElement, FOLLink, SVGGElement, unknown>;
  private node?: d3.Selection<SVGGElement, FOLNode, SVGGElement, unknown>;

  private zoom?: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private drag?: d3.DragBehavior<SVGGElement, FOLNode, FOLNode>;

  private draggableLink?: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private draggableLinkSourceNode?: FOLNode;
  private draggableLinkEnd?: [number, number];

  @HostListener('window:resize', ['$event'])
  onResize(_: any): void {
    this.cleanInitGraph();
  }

  ngAfterViewInit(): void {
    this.initGraph();

    [
      { id: '0', constants: ['a', 'd', 'f'] },
      { id: '1', constants: ['b'] },
      { id: '2', constants: ['c'] },
      { id: '3', constants: ['g'] },
    ].forEach((n) => this.graph.createNode(n.id, undefined, n.constants));
    [
      { source: this.graph.nodes[0], target: this.graph.nodes[0], relations: ['R'] },
      { source: this.graph.nodes[0], target: this.graph.nodes[1], relations: ['A'] },
      { source: this.graph.nodes[1], target: this.graph.nodes[2], relations: ['B'] },
      { source: this.graph.nodes[2], target: this.graph.nodes[1], relations: ['B'] },
    ].forEach((l) => this.graph.createLink(l.source, l.target, l.relations));
    this.lastNodeId = 4;
    this.onResize(null);
  }

  resetGraph(): void {
    this.simulation!.stop();
    this.graph.nodes.forEach((node) => {
      node.fx = undefined;
      node.fy = undefined;
    });
    this.cleanInitGraph();
  }

  restart(): void {
    this.link = this.link!.data(this.graph.links, (d: FOLLink) => d.source + '-' + d.target)
      .join('path')
      .classed('link', true)
      .on('contextmenu', (event: MouseEvent, d) => {
        terminate(event);
        this.linkSelected.emit(d);
      })
      .on('pointerenter', (event, d: FOLLink) => this.showTooltip(event, [...d.relations, ...d.functions].join(', ')))
      .on('pointerout', () => this.hideTooltip())
      .style('marker-end', 'url(#link-arrow');

    this.node = this.node!.data(this.graph.nodes, (d) => d.id).join((enter) => {
      const nodeGroup = enter
        .append('g')
        .call(this.drag!)
        .on('contextmenu', (event: MouseEvent, d) => {
          terminate(event);
          this.nodeSelected.emit(d);
        });
      nodeGroup
        .append('circle')
        .classed('node', true)
        .attr('r', this.config.nodeRadius)
        .style('stroke-width', `${this.config.nodeBorder}`)
        .on('pointerenter', (event, d: FOLNode) => this.showTooltip(event, [...d.relations, ...d.constants].join(', ')))
        .on('pointerout', () => this.hideTooltip())
        .on('pointerdown', (event: PointerEvent, d) => this.onPointerDown(event, d))
        .on('pointerup', (event: PointerEvent, d) => this.onPointerUp(event, d));
      nodeGroup
        .append('text')
        .text((d) => d.id)
        .classed('label node-id', true)
        .attr('text-anchor', 'middle')
        .attr('dy', `0.33em`);
      nodeGroup.append('text').classed('label node-details', true).attr('text-anchor', 'middle').attr('dy', `-2rem`);
      return nodeGroup;
    });

    this.node.select('.node-details').text((d) => [...d.relations, ...d.constants].join(', '));

    this.simulation!.nodes(this.graph.nodes);
    this.simulation!.alpha(0.3).restart();
  }

  private cleanInitGraph(): void {
    this.clean();
    this.initGraph();
  }

  private initGraph(): void {
    this.width = this.graphHost.nativeElement.clientWidth;
    this.height = this.graphHost.nativeElement.clientHeight;
    this.initZoom();
    this.initCanvas();
    this.initMarkers();
    if (this.isEditMode) {
      this.initDraggableLink();
    }
    this.initLink();
    this.initNode();
    this.initSimulation();
    this.initDrag();
    this.restart();
  }

  private initZoom(): void {
    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 1])
      .filter((event) => event.button === 0)
      .on('zoom', (event) => this.zoomed(event));
  }

  private initCanvas(): void {
    this.canvas = d3
      .select(this.graphHost.nativeElement)
      .append('svg')
      .on('pointermove', (event: PointerEvent) => this.pointerMoved(event))
      .on('pointerup', () => this.pointerRaised())
      .on('contextmenu', (event: MouseEvent) => terminate(event))
      .attr('width', this.width)
      .attr('height', this.height)
      .on('dblclick', (event) => this.createNode(d3.pointer(event, this.canvas!.node())[0], d3.pointer(event, this.canvas!.node())[1]))
      .call(this.zoom!)
      .append('g');
  }

  private initMarkers(): void {
    this.canvas!.append('defs')
      .append('marker')
      .attr('id', 'link-arrow')
      .attr('viewBox', this.config.markerPath)
      .attr('refX', this.config.markerRef)
      .attr('refY', this.config.markerRef)
      .attr('markerWidth', this.config.markerBoxSize)
      .attr('markerHeight', this.config.markerBoxSize)
      .attr('orient', 'auto')
      .classed('arrow', true)
      .append('path')
      .attr('d', `${d3.line()(this.config.arrowPoints)}`);
  }

  private initDraggableLink(): void {
    this.draggableLink = this.canvas!.append('path').classed('link draggable hidden', true).attr('d', 'M0,0L0,0');
  }

  private initLink(): void {
    this.link = this.canvas!.append('g').classed('links', true).selectAll('path');
  }

  private initNode(): void {
    this.node = this.canvas!.append('g').classed('nodes', true).selectAll('circle');
  }

  private initSimulation(): void {
    this.simulation = d3
      .forceSimulation<FOLNode, FOLLink>(this.graph.nodes)
      .force('charge', d3.forceManyBody<FOLNode>().strength(-500))
      .force('collision', d3.forceCollide<FOLNode>().radius(20))
      .force(
        'link',
        d3
          .forceLink<FOLNode, FOLLink>()
          .links(this.graph.links)
          .id((d: FOLNode) => d.id)
          .distance(this.config.nodeRadius * 10)
      )
      .force('x', d3.forceX<FOLNode>(this.width / 2))
      .force('y', d3.forceY<FOLNode>(this.height / 2))
      .on('tick', () => this.tick());
  }

  private initDrag(): void {
    this.drag = d3
      .drag<SVGGElement, FOLNode, FOLNode>()
      .filter((event) => event.button === 1)
      .on('start', (event: D3DragEvent<SVGCircleElement, FOLNode, FOLNode>, d: FOLNode) => {
        terminate(event.sourceEvent);
        this.canShowTooltip = false;
        this.hideTooltip();
        if (event.active === 0) {
          this.simulation!.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: D3DragEvent<SVGCircleElement, FOLNode, FOLNode>, d: FOLNode) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: D3DragEvent<SVGCircleElement, FOLNode, FOLNode>) => {
        this.canShowTooltip = true;
        if (event.active === 0) {
          this.simulation!.alphaTarget(0);
        }
      });
  }

  private tick(): void {
    this.node!.attr('transform', (d) => `translate(${d.x},${d.y})`);

    this.link!.attr('d', (d) => {
      if (d.source.id === d.target.id) {
        return reflexivePath(d.source, this.config);
      } else if (this.isBidirectional(d)) {
        return arcPath(d.source, d.target, this.config);
      } else {
        return directPath(d.source, d.target, this.config);
      }
    });

    if (this.draggableLinkEnd !== undefined && this.draggableLinkSourceNode !== undefined) {
      const from: [number, number] = [this.draggableLinkSourceNode!.x!, this.draggableLinkSourceNode!.y!];
      this.draggableLink!.attr('d', linePath(from, this.draggableLinkEnd));
    }
  }

  private onPointerDown(event: PointerEvent, node: FOLNode): void {
    if (!this.isEditMode || event.button !== 0) {
      return;
    }
    terminate(event);
    const coordinates: [number, number] = [node.x!, node.y!];
    this.draggableLinkEnd = coordinates;
    this.draggableLinkSourceNode = node;
    this.draggableLink!.style('marker-end', 'url(#link-arrow').classed('hidden', false).attr('d', linePath(coordinates, coordinates));
    this.restart();
  }

  private pointerMoved(event: PointerEvent): void {
    terminate(event);
    if (this.draggableLinkSourceNode !== undefined) {
      const from: [number, number] = [this.draggableLinkSourceNode!.x!, this.draggableLinkSourceNode!.y!];
      const to: [number, number] = [d3.pointer(event)[0] - this.xOffset, d3.pointer(event)[1] - this.yOffset];
      this.draggableLinkEnd = to;
      this.draggableLink!.attr('d', linePath(from, to));
    }
  }

  private onPointerUp(event: PointerEvent, node: FOLNode): void {
    if (!this.isEditMode || this.draggableLinkSourceNode === undefined) {
      return;
    }
    terminate(event);
    this.draggableLink!.classed('hidden', true).style('marker-end', '');
    const source = this.draggableLinkSourceNode;
    this.resetDraggableLink();
    this.createLink(source, node);
  }

  private resetDraggableLink(): void {
    this.draggableLinkSourceNode = undefined;
    this.draggableLinkEnd = undefined;
  }

  private clean(): void {
    this.simulation!.stop();
    d3.select(this.graphHost.nativeElement).selectChildren().remove();
    this.canShowTooltip = true;
    this.zoom = undefined;
    this.xOffset = 0;
    this.yOffset = 0;
    this.canvas = undefined;
    this.draggableLink = undefined;
    this.link = undefined;
    this.node = undefined;
    this.simulation = undefined;
    this.canShowTooltip = true;
    this.resetDraggableLink();
  }

  private zoomed(event: D3ZoomEvent<any, any>): void {
    this.xOffset = event.transform.x;
    this.yOffset = event.transform.y;
    this.canvas!.attr('transform', `translate(${this.xOffset},${this.yOffset})scale(${event.transform.k})`);
  }

  private isBidirectional(link: FOLLink): boolean {
    return link.source.id !== link.target.id && this.graph.links.findIndex((l) => l.target.id === link.source.id && l.source.id === link.target.id) !== -1;
  }

  private pointerRaised(): void {
    this.draggableLink?.classed('hidden', true).style('marker-end', '');
    this.resetDraggableLink();
  }

  private showTooltip(event: PointerEvent, text: string): void {
    if (!this.canShowTooltip) {
      return;
    }
    d3.select(this.tooltip.nativeElement).transition().duration(this.config.tooltipFadeInTame).style('opacity', this.config.tooltipOpacity);
    d3.select(this.tooltip.nativeElement)
      .html(text)
      .style('left', event.pageX + 'px')
      .style('top', event.pageY - 28 + 'px');
  }

  private hideTooltip(): void {
    d3.select(this.tooltip.nativeElement).transition().duration(this.config.tooltipFadeOutTime).style('opacity', 0);
  }

  async createNode(x: number = this.width / 2, y: number = this.height / 2): Promise<void> {
    if (!this.isEditMode) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const node = await this.graph.createNode(`${this.lastNodeId++}`, undefined, undefined, x, y);
    this.restart();
    this.nodeSelected.emit(node);
  }

  removeNode(node: FOLNode): void {
    if (!this.isEditMode) {
      return;
    }
    this.hideTooltip();
    this.graph.removeNode(node).then(([deletedNode, deletedLinks]) => {
      this.restart();
      this.nodeDeleted.emit(deletedNode);
      deletedLinks.forEach((deletedLink) => this.linkDeleted.emit(deletedLink));
    });
  }

  private async createLink(source: FOLNode, target: FOLNode): Promise<void> {
    if (!this.isEditMode) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const link = await this.graph.createLink(source, target);
    this.restart();
    this.linkSelected.emit(link);
  }

  removeLink(link: FOLLink): void {
    if (!this.isEditMode) {
      return;
    }
    this.hideTooltip();
    this.graph.removeLink(link).then((deletedLink) => {
      this.restart();
      this.linkDeleted.emit(deletedLink);
    });
  }
}
