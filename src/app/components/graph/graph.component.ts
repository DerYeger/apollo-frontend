import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { D3DragEvent, D3ZoomEvent } from 'd3';
import { concat, forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { GraphConfiguration, DEFAULT_GRAPH_CONFIGURATION } from 'src/app/configurations/graph.configuration';
import D3Graph from 'src/app/model/d3/d3.graph';
import { D3Link } from 'src/app/model/d3/d3.link';
import { D3Node } from 'src/app/model/d3/d3.node';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { enableSimulation, toggleLabels, toggleSimulation } from 'src/app/store/actions';
import { GraphSettings, State } from 'src/app/store/state';
import {
  paddedArcPath,
  directLinkTextTransform,
  paddedLinePath,
  linePath,
  reflexiveLinkTextTransform,
  paddedReflexivePath,
  bidirectionalLinkTextTransform,
} from 'src/app/utils/d3.utils';
import { terminate } from 'src/app/utils/event.utils';
import { ExportGraphBottomSheet } from '../bottom-sheets/export-graph/export-graph.bottom-sheet';
import { SaveGraphDialog } from '../dialogs/save-graph/save-graph.dialog';

@Component({
  selector: 'gramofo-graph[graph][allowEditing]',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() public graph: D3Graph | null | undefined = new D3Graph();

  @Input() public allowEditing!: boolean;
  @Input() public config: GraphConfiguration = DEFAULT_GRAPH_CONFIGURATION;

  @Input() public graphExportRequests?: Observable<void>;
  private graphExportRequestsSubscription?: Subscription;

  @Output() public readonly linkSelected = new EventEmitter<D3Link>();
  @Output() public readonly nodeSelected = new EventEmitter<D3Node>();

  @Output() public readonly linkDeleted = new EventEmitter<D3Link>();
  @Output() public readonly nodeDeleted = new EventEmitter<D3Node>();

  @Output() public readonly saveRequested = new EventEmitter<FOLGraph>();
  @Output() public readonly graphExported = new EventEmitter<FOLGraph>();

  // TranslateService::stream and TranslateService::onLangChange do not properly emit upon first subscription.
  // As a workaround, we emit a dummy value froma second observable to trigger the forkJoin and call TranslateService::get instead.
  public readonly controlsTooltipText: Observable<string> = concat(of(true), this.translate.onLangChange).pipe(
    mergeMap(() => forkJoin([this.translate.get('graph.controls.view'), this.translate.get('graph.controls.graph')])),
    map(([view, controls]) => (this.allowEditing ? view + '\n' + controls : view))
  );

  public readonly graphSettings = this.store.select('graphSettings');
  private graphSettingsSubscription?: Subscription;

  private enableSimulation = true;
  private showLabels = true;

  private width = 0;
  private height = 0;

  private xOffset = 0;
  private yOffset = 0;

  @ViewChild('graphHost')
  private readonly graphHost!: ElementRef<HTMLDivElement>;

  @ViewChild('tooltip')
  private readonly tooltip!: ElementRef<HTMLDivElement>;
  private canShowTooltip = true;

  private simulation?: d3.Simulation<D3Node, D3Link>;

  private canvas?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private link?: d3.Selection<SVGGElement, D3Link, SVGGElement, unknown>;
  private node?: d3.Selection<SVGGElement, D3Node, SVGGElement, unknown>;

  private zoom?: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private drag?: d3.DragBehavior<SVGGElement, D3Node, D3Node>;

  private draggableLink?: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private draggableLinkSourceNode?: D3Node;
  private draggableLinkTargetNode?: D3Node;
  private draggableLinkEnd?: [number, number];

  constructor(
    private readonly store: Store<State>,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.graph.currentValue) {
      // Perform clean init of the Graph. Enable the simulation for proper layouting.
      this.cleanInitGraph();
      if (!this.enableSimulation) {
        // This will trigger a restart, so immediate restarting is not neccessary.
        this.store.dispatch(enableSimulation());
      } else {
        this.restart(1);
      }
    } else {
      // Graph input not provided or not yet present (async). Use fallback.
      this.graph = new D3Graph();
    }
    if (changes.graphExportRequests) {
      this.graphExportRequestsSubscription?.unsubscribe();
      this.graphExportRequestsSubscription = this.graphExportRequests?.subscribe(() => this.graphExported.emit(this.graph!.toDomainGraph()));
    }
  }

  ngAfterViewInit(): void {
    this.initGraph();
    this.graphSettingsSubscription = this.graphSettings.subscribe((settings) => this.onSettingsChanged(settings));
  }

  @HostListener('window:resize', ['$event'])
  ngAfterViewChecked(): void {
    const newWidth = this.graphHost.nativeElement.offsetWidth;
    const newHeight = this.graphHost.nativeElement.offsetHeight;
    const widthDiffers = this.width.toFixed(2) !== newWidth.toFixed(2);
    const heightDiffers = this.height.toFixed(2) !== newHeight.toFixed(2);
    if (widthDiffers || heightDiffers) {
      this.cleanInitGraph(newWidth, newHeight);
    }
  }

  private onSettingsChanged(settings: GraphSettings): void {
    const simulationChanged = this.enableSimulation !== settings.enableSimulation;
    const labelsChanged = this.showLabels !== settings.showLabels;
    this.enableSimulation = settings.enableSimulation;
    this.showLabels = settings.showLabels;
    if (simulationChanged) {
      this.simulation?.stop();
      if (this.enableSimulation) {
        this.graph!.unlockNodes();
      }
      this.initSimulation();
    }
    if (simulationChanged || labelsChanged) {
      this.restart(1);
    }
  }

  ngOnDestroy(): void {
    this.graphSettingsSubscription?.unsubscribe();
    this.graphExportRequestsSubscription?.unsubscribe();
  }

  saveGraph(): void {
    this.dialog
      .open(SaveGraphDialog, {
        data: this.graph!.toDomainGraph(),
      })
      .afterClosed()
      .toPromise()
      .then((domainGraph) => {
        if (domainGraph !== undefined) {
          this.saveRequested.emit(domainGraph);
        }
      });
  }

  exportGraph(): void {
    this.bottomSheet.open(ExportGraphBottomSheet, {
      data: this.graph!.toDomainGraph(),
    });
  }

  toggleLabels(): void {
    this.store.dispatch(toggleLabels());
  }

  toggleSimulation(): void {
    this.store.dispatch(toggleSimulation());
  }

  resetGraph(): void {
    this.graph!.unlockNodes();
    this.cleanInitGraph();
    this.store.dispatch(enableSimulation());
  }

  restart(alpha: number = 0.5): void {
    this.link = this.link!.data(this.graph!.links, (d: D3Link) => `${d.source.id}-${d.target.id}`).join((enter) => {
      const linkGroup = enter.append('g');
      linkGroup.append('path').classed('link', true).style('marker-end', 'url(#link-arrow');
      linkGroup
        .append('path')
        .classed('clickbox', true)
        .on('contextmenu', (event: MouseEvent, d) => {
          terminate(event);
          this.linkSelected.emit(d);
        })
        .on('mouseenter', (event, d: D3Link) => this.showTooltip(event, [...d.relations, ...d.functions].join(', ')))
        .on('mouseout', () => this.hideTooltip());
      linkGroup.append('text').classed('link-details', true);
      return linkGroup;
    });

    this.node = this.node!.data(this.graph!.nodes, (d) => d.id).join((enter) => {
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
        .on('mouseenter', (event, d: D3Node) => {
          this.showTooltip(event, [...d.relations, ...d.constants].join(', '));
          this.draggableLinkTargetNode = d;
        })
        .on('mouseout', () => {
          this.hideTooltip();
          this.draggableLinkTargetNode = undefined;
        })
        .on('pointerdown', (event: PointerEvent, d) => this.onPointerDown(event, d))
        .on('pointerup', (event: PointerEvent) => this.onPointerUp(event));
      nodeGroup
        .append('text')
        .text((d) => d.id)
        .classed('node-id', true)
        .attr('dy', `0.33em`);
      nodeGroup.append('text').classed('node-details', true).attr('dy', `-2em`);
      return nodeGroup;
    });

    this.link
      .select('.link-details')
      .attr('opacity', this.showLabels ? 1 : 0)
      .text((d) => [...d.relations, ...d.functions].join(', '));

    this.node
      .select('.node-details')
      .attr('opacity', this.showLabels ? 1 : 0)
      .text((d) => [...d.relations, ...d.constants].join(', '));

    this.simulation!.nodes(this.graph!.nodes);
    this.simulation!.alpha(alpha).restart();
  }

  cleanInitGraph(width?: number, height?: number): void {
    this.clean();
    this.initGraph(width, height);
  }

  private initGraph(width: number = this.graphHost.nativeElement.clientWidth, height: number = this.graphHost.nativeElement.clientHeight): void {
    this.width = width;
    this.height = height;
    this.initZoom();
    this.initCanvas();
    this.initMarkers();
    if (this.allowEditing) {
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
      .attr('width', '100%')
      .attr('height', '100%')
      .on('pointermove', (event: PointerEvent) => this.pointerMoved(event))
      // .on('touchmove', (event: TouchEvent) => this.pointerMoved(event))
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
    this.simulation = d3.forceSimulation<D3Node, D3Link>(this.graph!.nodes).on('tick', () => this.tick());
    if (this.enableSimulation) {
      this.simulation
        .force('charge', d3.forceManyBody<D3Node>().strength(-500))
        .force('collision', d3.forceCollide<D3Node>().radius(this.config.nodeRadius))
        .force(
          'link',
          d3
            .forceLink<D3Node, D3Link>()
            .links(this.graph!.links)
            .id((d: D3Node) => d.id)
            .distance(this.config.nodeRadius * 10)
        )
        .force('x', d3.forceX<D3Node>(this.width / 2).strength(0.05))
        .force('y', d3.forceY<D3Node>(this.height / 2).strength(0.05));
    }
  }

  private initDrag(): void {
    this.drag = d3
      .drag<SVGGElement, D3Node, D3Node>()
      .filter((event) => event.button === 1)
      .on('start', (event: D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) => {
        terminate(event.sourceEvent);
        this.canShowTooltip = false;
        this.hideTooltip();
        if (event.active === 0) {
          this.simulation!.alphaTarget(0.5).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) => {
        this.canShowTooltip = true;
        if (event.active === 0) {
          this.simulation!.alphaTarget(0);
        }
      });
  }

  private tick(): void {
    this.node!.attr('transform', (d) => `translate(${d.x},${d.y})`);

    this.link!.selectAll<SVGPathElement, D3Link>('path').attr('d', (d: D3Link) => {
      if (d.source.id === d.target.id) {
        return paddedReflexivePath(d.source, [this.width / 2, this.height / 2], this.config);
      } else if (this.isBidirectional(d.source, d.target)) {
        return paddedArcPath(d.source, d.target, this.config);
      } else {
        return paddedLinePath(d.source, d.target, this.config);
      }
    });

    this.link!.select('.link-details').attr('transform', (d: D3Link) => {
      if (d.source.id === d.target.id) {
        return reflexiveLinkTextTransform(d.source, [this.width / 2, this.height / 2], this.config);
      } else if (this.isBidirectional(d.source, d.target)) {
        return bidirectionalLinkTextTransform(d.source, d.target, this.config);
      } else {
        return directLinkTextTransform(d.source, d.target);
      }
    });

    this.updateDraggableLinkPath();
  }

  private updateDraggableLinkPath(): void {
    const source = this.draggableLinkSourceNode;
    if (source !== undefined) {
      const target = this.draggableLinkTargetNode;
      if (target !== undefined) {
        this.draggableLink!.attr('d', () => {
          if (source.id === target.id) {
            return paddedReflexivePath(source, [this.width / 2, this.height / 2], this.config);
          } else if (this.isBidirectional(source, target)) {
            return paddedLinePath(source, target, this.config);
          } else {
            return paddedArcPath(source, target, this.config);
          }
        });
      } else if (this.draggableLinkEnd !== undefined) {
        const from: [number, number] = [source.x!, source.y!];
        this.draggableLink!.attr('d', linePath(from, this.draggableLinkEnd));
      }
    }
  }

  private onPointerDown(event: PointerEvent, node: D3Node): void {
    if (!this.allowEditing || event.button !== 0) {
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
      const pointer = d3.pointers(event, this.graphHost.nativeElement)[0];
      const point: [number, number] = [pointer[0] - this.xOffset, pointer[1] - this.yOffset];
      if (event.pointerType === 'touch') {
        point[1] = point[1] - 4 * this.config.nodeRadius;
        // PointerEvents are not firing correctly for touch input.
        // So for TouchEvents, we have to manually detect Nodes within range and set them as the current target node.
        this.draggableLinkTargetNode = this.graph!.nodes.find((node) => Math.sqrt(Math.pow(node.x! - point[0], 2) + Math.pow(node.y! - point[1], 2)) < this.config.nodeRadius);
      }
      this.draggableLinkEnd = point;
      this.updateDraggableLinkPath();
    }
  }

  private onPointerUp(event: PointerEvent): void {
    const target = this.draggableLinkTargetNode;
    if (!this.allowEditing || this.draggableLinkSourceNode === undefined || target === undefined) {
      return;
    }
    terminate(event);
    const source = this.draggableLinkSourceNode;
    this.resetDraggableLink();
    this.createLink(source, target);
  }

  private resetDraggableLink(): void {
    this.draggableLink?.classed('hidden', true).style('marker-end', '');
    this.draggableLinkSourceNode = undefined;
    this.draggableLinkTargetNode = undefined;
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
    this.canvas!.attr('transform', `translate(${this.xOffset},${this.yOffset})`);
  }

  private isBidirectional(source: D3Node, target: D3Node): boolean {
    return (
      source.id !== target.id &&
      this.graph!.links.some((l) => l.target.id === source.id && l.source.id === target.id) &&
      this.graph!.links.some((l) => l.target.id === target.id && l.source.id === source.id)
    );
  }

  private pointerRaised(): void {
    this.draggableLink?.classed('hidden', true).style('marker-end', '');
    this.resetDraggableLink();
  }

  private showTooltip(event: PointerEvent, text: string): void {
    if (!this.canShowTooltip) {
      return;
    }
    const tooltipSelection = d3.select(this.tooltip.nativeElement);
    tooltipSelection.transition().duration(this.config.tooltipFadeInTame).style('opacity', this.config.tooltipOpacity);
    tooltipSelection
      .html(text.length > 0 ? text : '-')
      .style('left', `calc(${event.offsetX}px + ${2 * this.config.nodeRadius}px)`)
      .style('top', `calc(${event.offsetY}px`);
  }

  private hideTooltip(): void {
    d3.select(this.tooltip.nativeElement).transition().duration(this.config.tooltipFadeOutTime).style('opacity', 0);
  }

  async createNode(x: number = this.width / 2 - this.xOffset, y: number = this.height / 2 - this.yOffset): Promise<void> {
    if (!this.allowEditing) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const node = await this.graph!.createNodeWithGeneratedId(x, y);
    this.restart();
    this.nodeSelected.emit(node);
  }

  removeNode(node: D3Node): void {
    if (!this.allowEditing) {
      return;
    }
    this.hideTooltip();
    this.resetDraggableLink();
    this.graph!.removeNode(node).then(([deletedNode, deletedLinks]) => {
      this.restart();
      this.nodeDeleted.emit(deletedNode);
      deletedLinks.forEach((deletedLink) => this.linkDeleted.emit(deletedLink));
    });
  }

  private createLink(source: D3Node, target: D3Node): Promise<void> {
    if (!this.allowEditing) {
      return Promise.reject('Graph is not in edit mode.');
    }
    return this.graph!.createLink(source.id, target.id)
      .then((newLink) => {
        this.restart();
        this.linkSelected.emit(newLink);
      })
      .catch((existingLink: D3Link) => this.linkSelected.emit(existingLink));
  }

  removeLink(link: D3Link): void {
    if (!this.allowEditing) {
      return;
    }
    this.hideTooltip();
    this.graph!.removeLink(link).then((deletedLink) => {
      this.restart();
      this.linkDeleted.emit(deletedLink);
    });
  }
}
