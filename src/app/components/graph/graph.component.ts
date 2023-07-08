import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { D3ZoomEvent } from 'd3';
import { concat, firstValueFrom, forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ExportGraphBottomSheet } from 'src/app/bottom-sheets/export-graph/export-graph.bottom-sheet';
import { DEFAULT_GRAPH_CONFIGURATION, GraphConfiguration } from 'src/app/configurations/graph.configuration';
import { SaveGraphDialog } from 'src/app/dialogs/save-graph/save-graph.dialog';
import D3Graph from 'src/app/model/d3/d3.graph';
import { D3Link } from 'src/app/model/d3/d3.link';
import { D3Node } from 'src/app/model/d3/d3.node';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { enableSimulation, toggleLabels, toggleSimulation } from 'src/app/store/actions';
import { GraphSettings, State } from 'src/app/store/state';
import { Canvas, createCanvas } from 'src/app/utils/d3/canvas';
import { createDrag, Drag, NodeDragEvent } from 'src/app/utils/d3/drag';
import { createDraggableLink, DraggableLink } from 'src/app/utils/d3/draggable-link';
import { createLinkSelection, LinkSelection } from 'src/app/utils/d3/link-selection';
import { initMarkers } from 'src/app/utils/d3/markers';
import { createNodeSelection, NodeSelection } from 'src/app/utils/d3/node-selection';
import {
  bidirectionalLinkTextTransform,
  directLinkTextTransform,
  linePath,
  paddedArcPath,
  paddedLinePath,
  paddedReflexivePath,
  reflexiveLinkTextTransform,
} from 'src/app/utils/d3/paths';
import { createSimulation, Simulation } from 'src/app/utils/d3/simulation';
import { createZoom, Zoom } from 'src/app/utils/d3/zoom';
import { terminate } from 'src/app/utils/events';

/**
 * The interactive graph component.
 */
@Component({
  selector: 'apollo-graph[graph][allowEditing]',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnChanges, OnDestroy, AfterViewChecked {
  /**
   * The graph that will be displayed.
   * Can be changed after initialization.
   * For proper usage see GraphEditorComponent and ModelCheckerPage.
   */
  @Input() public graph: D3Graph | null | undefined = new D3Graph();

  /**
   * Allows editing if set to true.
   * Should not be changed after initialization.
   */
  @Input() public allowEditing!: boolean;

  /**
   * Configuration for visuals of the graph.
   * Should not be changed after initialization.
   */
  @Input() public config: GraphConfiguration = DEFAULT_GRAPH_CONFIGURATION;

  /**
   * Graph will be exported when export-requests are received.
   */
  @Input() public graphExportRequests?: Observable<void>;

  @Output() public readonly linkSelected = new EventEmitter<D3Link>();
  @Output() public readonly nodeSelected = new EventEmitter<D3Node>();

  @Output() public readonly linkDeleted = new EventEmitter<D3Link>();
  @Output() public readonly nodeDeleted = new EventEmitter<D3Node>();

  @Output() public readonly saveRequested = new EventEmitter<FOLGraph>();
  @Output() public readonly graphExported = new EventEmitter<FOLGraph>();

  @ViewChild('graphHost') private readonly graphHost!: ElementRef<HTMLDivElement>;

  // TranslateService::stream and TranslateService::onLangChange do not properly emit upon first subscription.
  // As a workaround, we emit a dummy value froma second observable to trigger the forkJoin and call TranslateService::get instead.
  public readonly controlsTooltipText: Observable<string> = concat(of(true), this.translate.onLangChange).pipe(
    mergeMap(() => forkJoin([this.translate.get('graph.controls.view'), this.translate.get('graph.controls.graph')])),
    map(([view, controls]) => (this.allowEditing ? view + '\n' + controls : view)),
  );

  public readonly graphSettings = this.store.select('graphSettings');

  private graphSettingsSubscription?: Subscription;
  private graphExportRequestsSubscription?: Subscription;

  private enableSimulation = true;
  private showLabels = true;

  private width = 0;
  private height = 0;

  private xOffset = 0;
  private yOffset = 0;

  private scale = 1;

  private simulation?: Simulation;

  private canvas?: Canvas;
  private linkSelection?: LinkSelection;
  private nodeSelection?: NodeSelection;

  private zoom?: Zoom;
  private drag?: Drag;

  private draggableLink?: DraggableLink;
  private draggableLinkSourceNode?: D3Node;
  private draggableLinkTargetNode?: D3Node;
  private draggableLinkEnd?: [number, number];

  public constructor(
    private readonly store: Store<State>,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet,
  ) {}

  /**
   * Redraws the entire graph with new sizes.
   */
  @HostListener('window:resize', ['$event'])
  public ngAfterViewChecked(): void {
    const newWidth = this.graphHost.nativeElement.offsetWidth;
    const newHeight = this.graphHost.nativeElement.offsetHeight;
    const widthDiffers = this.width.toFixed(2) !== newWidth.toFixed(2);
    const heightDiffers = this.height.toFixed(2) !== newHeight.toFixed(2);

    if (!widthDiffers && !heightDiffers) {
      return;
    } else if (window.innerWidth <= 800 && !this.enableSimulation) {
      this.store.dispatch(enableSimulation());
    } else {
      this.cleanInitGraph(newWidth, newHeight);
    }
  }

  public ngAfterViewInit(): void {
    this.initGraph();
    this.graphSettingsSubscription = this.graphSettings.subscribe((settings) => this.onSettingsChanged(settings));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.graph.currentValue && this.graphHost !== undefined) {
      // Perform clean init of the Graph. Enable the simulation for proper layouting.
      this.cleanInitGraph();
      if (!this.enableSimulation) {
        // This will trigger a restart, so immediate restarting is not neccessary.
        this.store.dispatch(enableSimulation());
      } else {
        this.restart(1);
      }
    } else if (changes.graph.currentValue === null) {
      // Graph input not provided or not yet present (async). Use fallback.
      this.graph = new D3Graph();
    }
    if (changes.graphExportRequests) {
      this.graphExportRequestsSubscription?.unsubscribe();
      this.graphExportRequestsSubscription = this.graphExportRequests?.subscribe(() => this.graphExported.emit(this.graph!.toDomainGraph()));
    }
  }

  public ngOnDestroy(): void {
    this.graphSettingsSubscription?.unsubscribe();
    this.graphExportRequestsSubscription?.unsubscribe();
  }

  public saveGraph(): void {
    firstValueFrom(
      this.dialog
        .open(SaveGraphDialog, {
          data: this.graph!.toDomainGraph(),
        })
        .afterClosed(),
    ).then((domainGraph) => {
      if (domainGraph !== undefined) {
        this.saveRequested.emit(domainGraph);
      }
    });
  }

  public exportGraph(): void {
    this.bottomSheet.open(ExportGraphBottomSheet, {
      data: this.graph!.toDomainGraph(),
    });
  }

  public toggleLabels(): void {
    this.store.dispatch(toggleLabels());
  }

  public toggleSimulation(): void {
    this.store.dispatch(toggleSimulation());
  }

  public resetGraph(): void {
    this.cleanInitGraph();
    this.store.dispatch(enableSimulation());
  }

  public cleanInitGraph(width?: number, height?: number): void {
    this.resetView();
    this.initGraph(width, height);
  }

  /**
   * Creates, updates and deletes the displayed nodes and links.
   *
   * @param alpha Alpha value (heat, activity) of the simulation
   */
  public restart(alpha = 0.5): void {
    this.linkSelection = this.linkSelection!.data(this.graph!.links, (d: D3Link) => `${d.source.id}-${d.target.id}`).join((enter) => {
      const linkGroup = enter.append('g');
      linkGroup.append('path').classed('link', true).style('marker-end', 'url(#link-arrow');
      linkGroup
        .append('path')
        .classed('clickbox', true)
        .on('contextmenu', (event: MouseEvent, d) => {
          terminate(event);
          this.linkSelected.emit(d);
        });
      linkGroup.append('text').classed('link-details', true);
      return linkGroup;
    });

    this.nodeSelection = this.nodeSelection!.data(this.graph!.nodes, (d) => d.id).join((enter) => {
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
        .on('mouseenter', (_, d: D3Node) => (this.draggableLinkTargetNode = d))
        .on('mouseout', () => (this.draggableLinkTargetNode = undefined))
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

    this.linkSelection
      .select('.link-details')
      .attr('opacity', this.showLabels ? 1 : 0)
      .text((d) => [...d.relations, ...d.functions].join(', '));

    this.nodeSelection
      .select('.node-details')
      .attr('opacity', this.showLabels ? 1 : 0)
      .text((d) => [...d.relations, ...d.constants].join(', '));

    this.simulation!.nodes(this.graph!.nodes);
    this.simulation!.alpha(alpha).restart();
  }

  public async createNode(x: number = this.width / 2 - this.xOffset, y: number = this.height / 2 - this.yOffset): Promise<void> {
    if (!this.allowEditing) {
      return Promise.reject('Graph is not in edit mode.');
    }
    const node = await this.graph!.createNodeWithGeneratedId(x, y);
    this.restart();
    this.nodeSelected.emit(node);
  }

  public removeNode(node: D3Node): void {
    if (!this.allowEditing) {
      return;
    }
    this.resetDraggableLink();
    this.graph!.removeNode(node).then(([deletedNode, deletedLinks]) => {
      this.restart();
      this.nodeDeleted.emit(deletedNode);
      deletedLinks.forEach((deletedLink) => this.linkDeleted.emit(deletedLink));
    });
  }

  public createLink(source: D3Node, target: D3Node): Promise<void> {
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

  public removeLink(link: D3Link): void {
    if (!this.allowEditing) {
      return;
    }
    this.graph!.removeLink(link).then((deletedLink) => {
      this.restart();
      this.linkDeleted.emit(deletedLink);
    });
  }

  private initGraph(width: number = this.graphHost.nativeElement.clientWidth, height: number = this.graphHost.nativeElement.clientHeight): void {
    this.width = width;
    this.height = height;
    this.zoom = createZoom((event) => this.onZoom(event));
    this.canvas = createCanvas(
      d3.select(this.graphHost.nativeElement),
      this.zoom,
      (event: PointerEvent) => this.onPointerMoved(event),
      (event: PointerEvent) => this.onPointerUp(event),
      (event) => this.createNode(d3.pointer(event, this.canvas!.node())[0], d3.pointer(event, this.canvas!.node())[1]),
    );
    initMarkers(this.canvas, this.config);
    if (this.allowEditing) {
      this.draggableLink = createDraggableLink(this.canvas);
    }
    this.linkSelection = createLinkSelection(this.canvas);
    this.nodeSelection = createNodeSelection(this.canvas);
    this.simulation = this.createSimulation();
    this.drag = this.createDrag();
    this.restart();
  }

  private createSimulation(): Simulation {
    return createSimulation(this.graph!, this.config, this.width, this.height, this.enableSimulation, () => this.onTick());
  }

  private onTick(): void {
    this.nodeSelection!.attr('transform', (d) => `translate(${d.x},${d.y})`);

    this.linkSelection!.selectAll<SVGPathElement, D3Link>('path').attr('d', (d: D3Link) => {
      if (d.source.id === d.target.id) {
        return paddedReflexivePath(d.source, [this.width / 2, this.height / 2], this.config);
      } else if (this.isBidirectional(d.source, d.target)) {
        return paddedArcPath(d.source, d.target, this.config);
      } else {
        return paddedLinePath(d.source, d.target, this.config);
      }
    });

    this.linkSelection!.select('.link-details').attr('transform', (d: D3Link) => {
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

  private createDrag(): Drag {
    return createDrag(
      (event, node) => this.onDragStart(event, node),
      (event, node) => this.onDrag(event, node),
      (event, node) => this.onDragEnd(event, node),
    );
  }

  private onDragStart(event: NodeDragEvent, node: D3Node) {
    terminate(event.sourceEvent);
    if (event.active === 0) {
      this.simulation?.alphaTarget(0.5).restart();
    }
    node.fx = node.x;
    node.fy = node.y;
  }

  private onDrag(event: NodeDragEvent, node: D3Node) {
    node.fx = event.x;
    node.fy = event.y;
  }

  private onDragEnd(event: NodeDragEvent, node: D3Node) {
    if (event.active === 0) {
      this.simulation?.alphaTarget(0);
    }
    node.fx = undefined;
    node.fy = undefined;
  }

  private onPointerDown(event: PointerEvent, node: D3Node): void {
    if (!this.allowEditing || event.button !== 0) {
      return;
    }
    terminate(event);
    const coordinates: [number, number] = [node.x!, node.y!];
    this.draggableLinkEnd = coordinates;
    this.draggableLinkSourceNode = node;
    this.draggableLink!.style('marker-end', 'url(#draggable-link-arrow').classed('hidden', false).attr('d', linePath(coordinates, coordinates));
    this.restart();
  }

  private onPointerMoved(event: PointerEvent): void {
    terminate(event);
    if (this.draggableLinkSourceNode !== undefined) {
      const pointer = d3.pointers(event, this.graphHost.nativeElement)[0];
      const point: [number, number] = [(pointer[0] - this.xOffset) / this.scale, (pointer[1] - this.yOffset) / this.scale];
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
    const source = this.draggableLinkSourceNode;
    const target = this.draggableLinkTargetNode;
    this.resetDraggableLink();
    if (!this.allowEditing || source === undefined || target === undefined) {
      return;
    }
    terminate(event);
    this.createLink(source, target);
  }

  private resetDraggableLink(): void {
    this.draggableLink?.classed('hidden', true).style('marker-end', '');
    this.draggableLinkSourceNode = undefined;
    this.draggableLinkTargetNode = undefined;
    this.draggableLinkEnd = undefined;
  }

  private resetView(): void {
    this.simulation?.stop();
    d3.select(this.graphHost.nativeElement).selectChildren().remove();
    this.zoom = undefined;
    this.xOffset = 0;
    this.yOffset = 0;
    this.scale = 1;
    this.canvas = undefined;
    this.draggableLink = undefined;
    this.linkSelection = undefined;
    this.nodeSelection = undefined;
    this.simulation = undefined;
    this.resetDraggableLink();
  }

  private onZoom<E extends Element, D>(event: D3ZoomEvent<E, D>): void {
    this.xOffset = event.transform.x;
    this.yOffset = event.transform.y;
    this.scale = event.transform.k;
    this.canvas!.attr('transform', `translate(${this.xOffset},${this.yOffset})scale(${this.scale})`);
  }

  private isBidirectional(source: D3Node, target: D3Node): boolean {
    return (
      source.id !== target.id &&
      this.graph!.links.some((l) => l.target.id === source.id && l.source.id === target.id) &&
      this.graph!.links.some((l) => l.target.id === target.id && l.source.id === source.id)
    );
  }

  private onSettingsChanged(settings: GraphSettings): void {
    const simulationChanged = this.enableSimulation !== settings.enableSimulation;
    const labelsChanged = this.showLabels !== settings.showLabels;
    this.enableSimulation = settings.enableSimulation;
    this.showLabels = settings.showLabels;
    if (simulationChanged) {
      this.simulation?.stop();
      this.simulation = this.createSimulation();
    }
    if (simulationChanged || labelsChanged) {
      this.restart(1);
    }
  }
}
