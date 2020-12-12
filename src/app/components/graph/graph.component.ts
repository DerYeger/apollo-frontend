import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { D3DragEvent, D3ZoomEvent } from 'd3';
import { Observable, Subject } from 'rxjs';
import { GraphConfiguration, defaultGraphConfiguration } from 'src/app/configurations/graph.configuration';
import Graph from 'src/app/model/d3/graph';
import { Link } from 'src/app/model/d3/link';
import { Node } from 'src/app/model/d3/node';
import { arcPath, directPath, linePath, reflexivePath } from 'src/app/utils/d3.utils';
import { terminate } from 'src/app/utils/event.utils';

@Component({
  selector: 'gramofo-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class GraphComponent implements AfterViewInit {
  @Input() graph = new Graph();
  @Input() isEditMode = true;
  @Input() config: GraphConfiguration = defaultGraphConfiguration;
  @Input() linkDeletionRequests?: Observable<Link>;
  @Input() nodeDeletionRequests?: Observable<Node>;

  private readonly selectedLinkSubject$ = new Subject<Link>();
  @Output() readonly selectedLink$ = this.selectedLinkSubject$.asObservable();
  private readonly selectedNodeSubject$ = new Subject<Node>();
  @Output() readonly selectedNode$ = this.selectedNodeSubject$.asObservable();

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

  private simulation?: d3.Simulation<Node, Link>;

  private canvas?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private link?: d3.Selection<SVGPathElement, Link, SVGGElement, unknown>;
  private node?: d3.Selection<SVGGElement, Node, SVGGElement, unknown>;

  private zoom?: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private drag?: d3.DragBehavior<SVGGElement, Node, Node>;

  private draggableLink?: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private draggableLinkSourceNode?: Node;
  private draggableLinkEnd?: [number, number];

  @HostListener('window:resize', ['$event'])
  onResize(_: any): void {
    this.cleanInitGraph();
  }

  ngAfterViewInit(): void {
    this.initGraph();

    [
      { id: '0', attachments: ['a', 'd', 'f'] },
      { id: '1', attachments: ['b'] },
      { id: '2', attachments: ['c'] },
      { id: '3', attachments: ['g'] },
    ].forEach((n) => this.graph.createNode(n.id, n.attachments));
    [
      { source: this.graph.nodes[0], target: this.graph.nodes[0], attachments: ['R'] },
      { source: this.graph.nodes[0], target: this.graph.nodes[1], attachments: ['A'] },
      { source: this.graph.nodes[1], target: this.graph.nodes[2], attachments: ['B'] },
      { source: this.graph.nodes[2], target: this.graph.nodes[1], attachments: ['B'] },
    ].forEach((l) => this.graph.createLink(l.source, l.target, l.attachments));
    this.lastNodeId = 4;
    this.onResize(null);

    this.linkDeletionRequests?.subscribe((link) => this.removeLink(link));
    this.nodeDeletionRequests?.subscribe((node) => this.removeNode(node));
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
      .on('dblclick', (event) => this.createNode(event))
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
      .forceSimulation<Node, Link>(this.graph.nodes)
      .force('charge', d3.forceManyBody<Node>().strength(-500))
      .force('collision', d3.forceCollide<Node>().radius(20))
      .force(
        'link',
        d3
          .forceLink<Node, Link>()
          .links(this.graph.links)
          .id((d: Node) => d.id)
          .distance(this.config.nodeRadius * 10)
      )
      .force('x', d3.forceX<Node>(this.width / 2))
      .force('y', d3.forceY<Node>(this.height / 2))
      .on('tick', () => this.tick());
  }

  private initDrag(): void {
    this.drag = d3
      .drag<SVGGElement, Node, Node>()
      .filter((event) => event.button === 1)
      .on('start', (event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
        terminate(event.sourceEvent);
        this.canShowTooltip = false;
        this.hideTooltip();
        if (event.active === 0) {
          this.simulation!.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
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

  private restart(): void {
    this.link = this.link!.data(this.graph.links, (d: Link) => d.source + '-' + d.target)
      .join('path')
      .classed('link', true)
      .on('contextmenu', (event: MouseEvent, d) => {
        terminate(event);
        this.selectedLinkSubject$.next(d);
      })
      .on('pointerenter', (event, d: Link) => this.showTooltip(event, d.symbols.join(', ')))
      .on('pointerout', () => this.hideTooltip())
      .style('marker-end', 'url(#link-arrow');

    this.node = this.node!.data(this.graph.nodes, (d) => d.id)
      .join('g')
      .call(this.drag!)
      .on('contextmenu', (event: MouseEvent, d) => {
        terminate(event);
        this.selectedNodeSubject$.next(d);
      });

    this.node
      .append('circle')
      .classed('node', true)
      .attr('r', this.config.nodeRadius)
      .style('stroke-width', `${this.config.nodeBorder}`)
      .on('pointerenter', (event, d: Node) => this.showTooltip(event, d.symbols.join(', ')))
      .on('pointerout', () => this.hideTooltip())
      .on('pointerdown', (event: PointerEvent, d) => this.onPointerDown(event, d))
      .on('pointerup', (event: PointerEvent, d) => this.onPointerUp(event, d));

    this.node
      .append('text')
      .text((d) => d.id)
      .classed('label', true)
      .attr('text-anchor', 'middle')
      .attr('dy', `0.33em`);

    this.simulation!.nodes(this.graph.nodes);
    this.simulation!.alpha(0.3).restart();
  }

  private onPointerDown(event: PointerEvent, node: Node): void {
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

  private onPointerUp(event: PointerEvent, node: Node): void {
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

  private isBidirectional(link: Link): boolean {
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

  private createLink(source: Node, target: Node): void {
    this.addLink(source, target).then((link) => this.selectedLinkSubject$.next(link));
  }

  private async addNode(x?: number, y?: number): Promise<Node> {
    if (!this.isEditMode) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const node = await this.graph.createNode(`${this.lastNodeId++}`, undefined, x, y);
    this.restart();
    return node;
  }

  private removeNode(node: Node): void {
    if (!this.isEditMode) {
      return;
    }
    this.hideTooltip();
    this.graph.removeNode(node).then(() => this.restart());
  }

  private createNode(event: any): void {
    const x = d3.pointer(event, this.canvas!.node())[0];
    const y = d3.pointer(event, this.canvas!.node())[1];
    this.addNode(x, y).then((node) => this.selectedNodeSubject$.next(node));
  }

  private async addLink(source: Node, target: Node): Promise<Link> {
    if (!this.isEditMode) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const link = await this.graph.createLink(source, target);
    this.restart();
    return link;
  }

  private removeLink(link: Link): void {
    if (!this.isEditMode) {
      return;
    }
    this.hideTooltip();
    this.graph.removeLink(link).then(() => this.restart());
  }
}
