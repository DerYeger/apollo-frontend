import { FOLEdge } from '../domain/fol.edge';
import { FOLGraph } from '../domain/fol.graph';
import { FOLNode } from '../domain/fol.node';
import { D3Link, GramoFOLink } from './d3.link';
import { D3Node, GramoFONode } from './d3.node';

export default class D3Graph {
  public readonly nodes: D3Node[] = [];
  public readonly links: D3Link[] = [];

  constructor(public readonly name = '', public readonly description = '') {}

  static async fromDomainGraph(domainGraph: FOLGraph): Promise<D3Graph> {
    const graph = new D3Graph(domainGraph.name, domainGraph.description);
    await Promise.all(domainGraph.nodes.map((node) => graph.createNode(node.name, node.relations, node.constants)));
    await Promise.all(
      domainGraph.edges.map((edge) => {
        const source = graph.nodes.find((node) => node.id === edge.source);
        const target = graph.nodes.find((node) => node.id === edge.target);
        if (source === undefined || target === undefined) {
          return Promise.reject('graph.node-not-defined');
        }
        return graph.createLink(source, target, edge.relations, edge.functions);
      })
    );
    return Promise.resolve(graph);
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
      .reduce((prev, curr) => (prev >= curr ? prev : curr), 0);
    return this.createNode(`${highestCurrentId + 1}`, undefined, undefined, x, y);
  }

  public createNode(id: string, relations?: string[], constants?: string[], x?: number, y?: number): Promise<D3Node> {
    if (this.nodes.some((n) => n.id === id)) {
      return Promise.reject('graph.duplicate-id');
    }

    const node = new GramoFONode(id, relations, constants, x, y);
    this.nodes.push(node);
    return Promise.resolve(node);
  }

  public createLink(source: D3Node, target: D3Node, relations?: string[], functions?: string[]): Promise<D3Link> {
    const existingIndex = this.links.findIndex((l) => l.source.id === source.id && l.target.id === target.id);
    if (existingIndex !== -1) {
      return Promise.reject(this.links[existingIndex]);
    }

    const link = new GramoFOLink(source, target, relations, functions);
    this.links.push(link);
    return Promise.resolve(link);
  }

  public removeNode(node: D3Node): Promise<[D3Node, D3Link[]]> {
    const nodeIndex = this.nodes.findIndex((n) => n.id === node.id);
    if (nodeIndex === -1) {
      return Promise.reject('graph.node-does-not-exist');
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
      return Promise.reject('graph.link-does-not-exist');
    }

    this.links.splice(linkIndex, 1);
    return Promise.resolve(link);
  }
}
