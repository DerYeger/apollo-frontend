import { FOLEdge } from '../domain/fol.edge';
import { FOLGraph } from '../domain/fol.graph';
import { FOLNode } from '../domain/fol.node';
import { D3Link, GramoFOLink } from './d3.link';
import { D3Node, GramoFONode } from './d3.node';

/**
 * Graph class with D3.js compatability.
 */
export default class D3Graph {
  public readonly nodes: D3Node[] = [];
  public readonly links: D3Link[] = [];

  public constructor(public readonly name = `graph_${Date.now().toString()}`, public readonly description = '') {}

  public static async fromDomainGraph(domainGraph: FOLGraph): Promise<D3Graph> {
    const graph = new D3Graph(domainGraph.name, domainGraph.description);
    await Promise.all(domainGraph.nodes.map((node) => graph.createNode(node.name, node.relations, node.constants)));
    await Promise.all(domainGraph.edges.map((edge) => graph.createLink(edge.source, edge.target, edge.relations, edge.functions)));
    return Promise.resolve(graph);
  }

  private static relationsAreValid(relations?: string[]): boolean {
    return relations?.every((rel) => rel.charAt(0) === rel.charAt(0).toUpperCase()) ?? true;
  }

  private static functionsAreValid(functions?: string[]): boolean {
    return functions?.every((fun) => fun.charAt(0) === fun.charAt(0).toLowerCase()) ?? true;
  }

  public toDomainGraph(): FOLGraph {
    return {
      name: this.name,
      description: this.description,
      lastEdit: Date.now(),
      nodes: this.nodes.map<FOLNode>((node) => ({ name: node.id, relations: [...node.relations], constants: [...node.constants] })),
      edges: this.links.map<FOLEdge>((link) => ({ source: link.source.id, target: link.target.id, relations: [...link.relations], functions: [...link.functions] })),
    };
  }

  public unlockNodes(): void {
    this.nodes.forEach((node) => {
      node.fx = undefined;
      node.fy = undefined;
    });
  }

  public createNodeWithGeneratedId(x?: number, y?: number): Promise<D3Node> {
    const highestCurrentId = this.nodes
      .map((node) => +node.id)
      .filter((id) => !isNaN(id))
      .reduce((prev, curr) => (prev >= curr ? prev : curr), -1);
    return this.createNode(`${highestCurrentId + 1}`, undefined, undefined, x, y);
  }

  public createNode(id: string, relations?: string[], constants?: string[], x?: number, y?: number): Promise<D3Node> {
    if (this.nodes.some((n) => n.id === id)) {
      return Promise.reject({ key: 'validation.node.duplicate', params: { node: id } });
    } else if (!D3Graph.relationsAreValid(relations)) {
      return Promise.reject({ key: 'validation.node.invalid-relations', params: { node: id } });
    } else if (!D3Graph.functionsAreValid(constants)) {
      return Promise.reject({ key: 'validation.node.invalid-constants', params: { node: id } });
    }

    const node = new GramoFONode(id, relations, constants, x, y);
    this.nodes.push(node);
    return Promise.resolve(node);
  }

  public createLink(sourceId: string, targetId: string, relations?: string[], functions?: string[]): Promise<D3Link> {
    const existingLink = this.links.find((l) => l.source.id === sourceId && l.target.id === targetId);
    if (existingLink !== undefined) {
      return Promise.reject(existingLink);
    }

    const source = this.nodes.find((node) => node.id === sourceId);
    if (source === undefined) {
      return Promise.reject({ key: 'validation.node.missing', params: { node: sourceId } });
    }

    const target = this.nodes.find((node) => node.id === targetId);
    if (target === undefined) {
      return Promise.reject({ key: 'validation.node.missing', params: { node: targetId } });
    }

    if (!D3Graph.relationsAreValid(relations)) {
      return Promise.reject({ key: 'validation.edge.invalid-relations', params: { source: sourceId, target: targetId } });
    } else if (!D3Graph.functionsAreValid(functions)) {
      return Promise.reject({ key: 'validation.edge.invalid-functions', params: { source: sourceId, target: targetId } });
    }

    const link = new GramoFOLink(source, target, relations, functions);
    this.links.push(link);
    return Promise.resolve(link);
  }

  public removeNode(node: D3Node): Promise<[D3Node, D3Link[]]> {
    const nodeIndex = this.nodes.findIndex((n) => n.id === node.id);
    if (nodeIndex === -1) {
      return Promise.reject('validation.node.missing');
    }

    this.nodes.splice(nodeIndex, 1);
    const attachedLinks = this.links.filter((link) => link.source.id === node.id || link.target.id === node.id);
    attachedLinks.forEach((link) => {
      const linkIndex = this.links.indexOf(link, 0);
      this.links.splice(linkIndex, 1);
    });

    return Promise.resolve([node, attachedLinks]);
  }

  public removeLink(link: D3Link): Promise<D3Link> {
    const linkIndex = this.links.findIndex((l) => l.source.id === link.source.id && l.target.id === link.target.id);
    if (linkIndex === -1) {
      return Promise.reject('validation.edge.missing');
    }

    this.links.splice(linkIndex, 1);
    return Promise.resolve(link);
  }
}
