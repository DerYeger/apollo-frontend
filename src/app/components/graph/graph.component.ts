import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { D3DragEvent, D3ZoomEvent } from 'd3';
import { graphConfiguration as gc } from 'src/app/configurations/graph.configuration';
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

  @Input() readonly graph = new Graph();

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
    this.clean();
    this.initGraph();
  }

  ngAfterViewInit(): void {
    this.initGraph();

    [
      { id: '0', attachments: ['a', 'd', 'f'] },
      { id: '1', attachments: ['b'] },
      { id: '2', attachments: ['c'] },
      { id: '3', attachments: ['g'] }
    ].forEach(n => this.graph.createNode(n.id, n.attachments));
    [
      { source: this.graph.nodes[0], target: this.graph.nodes[0], attachments: ['R'] },
      { source: this.graph.nodes[0], target: this.graph.nodes[1], attachments: ['A'] },
      { source: this.graph.nodes[1], target: this.graph.nodes[2], attachments: ['B'] },
      { source: this.graph.nodes[2], target: this.graph.nodes[1], attachments: ['B'] }
    ].forEach(l => this.graph.createLink(l.source, l.target, l.attachments));
    this.lastNodeId = 4;
    this.onResize(null);
  }

  private initGraph(): void {
    this.width = this.graphHost.nativeElement.clientWidth;
    this.height = this.graphHost.nativeElement.clientHeight;
    this.initZoom();
    this.initCanvas();
    this.initMarkers();
    this.initDraggableLink();
    this.initLink();
    this.initNode();
    this.initSimulation();
    this.initDrag();
    this.restart();
  }

  private initZoom(): void {
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 1])
      .on('zoom', (event) => this.zoomed(event));
  }

  private initCanvas(): void {
    this.canvas = d3.select(this.graphHost.nativeElement)
      .append('svg')
      .on('mousemove', (event: PointerEvent) => this.pointerMoved(event))
      .on('mouseup', () => this.pointerRaised())
      .on('contextmenu', (event: MouseEvent) => terminate(event))
      .attr('width', this.width)
      .attr('height', this.height)
      .on('dblclick', (event) => this.addNode(d3.pointer(event, this.canvas!.node())[0], d3.pointer(event, this.canvas!.node())[1]))
      .call(this.zoom!)
      .on('dblclick.zoom', null)
      .append('g');
  }

  private initMarkers(): void {
    this.canvas!.append('defs').append('marker')
      .attr('id', 'link-arrow')
      .attr('viewBox', gc.markerPath)
      .attr('refX', gc.markerRef)
      .attr('refY', gc.markerRef)
      .attr('markerWidth', gc.markerBoxSize)
      .attr('markerHeight', gc.markerBoxSize)
      .attr('orient', 'auto')
      .classed('arrow', true)
      .append('path')
      .attr('d', `${d3.line()(gc.arrowPoints)}`);
  }

  private initDraggableLink(): void {
    this.draggableLink = this.canvas!.append('path')
      .classed('link draggable hidden', true)
      .attr('d', 'M0,0L0,0');
  }

  private initLink(): void {
    this.link = this.canvas!.append('g')
      .classed('links', true)
      .selectAll('path');
  }

  private initNode(): void {
    this.node = this.canvas!.append('g')
      .classed('nodes', true)
      .selectAll('circle');
  }

  private initSimulation(): void {
    this.simulation = d3.forceSimulation<Node, Link>(this.graph.nodes)
      .force('charge', d3.forceManyBody<Node>().strength(-500))
      .force('collision', d3.forceCollide<Node>().radius(20))
      .force('link', d3.forceLink<Node, Link>().links(this.graph.links).id((d: Node) => d.id).distance(gc.nodeRadius * 10))
      .force('x', d3.forceX<Node>(this.width / 2))
      .force('y', d3.forceY<Node>(this.height / 2))
      .on('tick', () => this.tick());
  }

  private initDrag(): void {
    this.drag = d3.drag<SVGGElement, Node, Node>()
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
    this.node!.attr('transform', d => `translate(${d.x},${d.y})`);

    this.link!.attr('d', d => {
      if (d.source.id === d.target.id) {
        return reflexivePath(d.source);
      } else if (this.isBidirectional(d)) {
        return arcPath(d.source, d.target);
      } else {
        return directPath(d.source, d.target);
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
        this.removeLink(d);
      })
      .on('mouseover', (event, d: Link) => this.showTooltip(event, d.symbols.join(', ')))
      .on('mouseout', () => this.hideTooltip())
      .style('marker-end', 'url(#link-arrow');

    this.node = this.node!.data(this.graph.nodes, d => d.id)
      .join('g')
      .call(this.drag!)
      .on('contextmenu', (event: MouseEvent, d) => {
        terminate(event);
        this.removeNode(d);
      });

    this.node.append('circle')
      .classed('node', true)
      .attr('r', gc.nodeRadius)
      .style('stroke-width', `${gc.nodeBorder}`)
      .on('mouseover', (event, d: Node) => this.showTooltip(event, d.symbols.join(', ')))
      .on('mouseout', () => this.hideTooltip())
      .on('mousedown', (event: MouseEvent, d) => {
        if (event.button !== 0) {
          return;
        }
        terminate(event);
        const coordinates: [number, number] = [d.x!, d.y!];
        this.draggableLinkEnd = coordinates;
        this.draggableLinkSourceNode = d;
        this.draggableLink!
          .style('marker-end', 'url(#link-arrow')
          .classed('hidden', false)
          .attr('d', linePath(coordinates, coordinates));
        this.restart();
      })
      .on('mouseup', (event: MouseEvent, d) => {
        if (this.draggableLinkSourceNode === undefined) {
          return;
        }
        terminate(event);
        this.draggableLink!
          .classed('hidden', true)
          .style('marker-end', '');
        const source = this.draggableLinkSourceNode;
        const target = d;
        this.resetDraggableLink();
        this.addLink(source, target);
      });

    this.node.append('text')
      .text(d => d.id)
      .classed('label', true)
      .attr('text-anchor', 'middle')
      .attr('dy', `0.33em`);

    this.simulation!.nodes(this.graph.nodes);
    this.simulation!.alpha(0.3).restart();
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
    return link.source.id !== link.target.id
      && this.graph.links.findIndex(l => l.target.id === link.source.id && l.source.id === link.target.id) !== -1;
  }

  private pointerMoved(event: PointerEvent): void {
    if (this.draggableLinkSourceNode !== undefined) {
      const from: [number, number] = [this.draggableLinkSourceNode!.x!, this.draggableLinkSourceNode!.y!];
      const to: [number, number] = [d3.pointer(event)[0] - this.xOffset, d3.pointer(event)[1] - this.yOffset];
      this.draggableLinkEnd = to;
      this.draggableLink!.attr('d', linePath(from, to));
    }
  }

  private pointerRaised(): void {
    this.draggableLink?.classed('hidden', true).style('marker-end', '');
    this.resetDraggableLink();
  }

  private showTooltip(event: MouseEvent, text: string): void {
    if (!this.canShowTooltip) {
      return;
    }
    d3.select(this.tooltip.nativeElement).transition()
      .duration(gc.tooltipFadeInTame)
      .style('opacity', gc.tooltipOpacity);
    d3.select(this.tooltip.nativeElement).html(text)
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }

  private hideTooltip(): void {
    d3.select(this.tooltip.nativeElement).transition()
      .duration(gc.tooltipFadeOutTime)
      .style('opacity', 0);
  }

  private addNode(x?: number, y?: number): void {
    this.graph
      .createNode(`${this.lastNodeId++}`, undefined, x, y)
      .then(() => this.restart());
  }

  private removeNode(node: Node): void {
    this.hideTooltip();
    this.graph
      .removeNode(node)
      .then(() => this.restart());
  }

  private addLink(source: Node, target: Node): void {
    this.graph
      .createLink(source, target)
      .then(() => this.restart());
  }

  private removeLink(link: Link): void {
    this.hideTooltip();
    this.graph
      .removeLink(link)
      .then(() => this.restart());
  }
}
