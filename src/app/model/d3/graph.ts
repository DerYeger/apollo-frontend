import { Node } from './node';
import { Link } from './link';

export default class Graph {

  public nodes: Node[] = [];
  public links: Link[] = [];

  public createNode(id: string, symbols?: string[], x?: number, y?: number): Promise<Node> {
    if (this.nodes.some(n => n.id === id)) {
      return Promise.reject('ID already in use.');
    }

    const node: Node = { id, symbols: symbols ?? [], x, y };
    this.nodes.push(node);
    return Promise.resolve(node);
  }

  public createLink(source: Node, target: Node, symbols?: string[]): Promise<Link> {
    if (this.links.some(l => l.source.id === source.id && l.target.id === target.id)) {
      return Promise.reject('Link already exists.');
    }

    const link: Link = { source, target, symbols: symbols ?? [] };
    this.links.push(link);
    return Promise.resolve(link);
  }

  public removeNode(node: Node): Promise<void> {
    const nodeIndex = this.nodes.findIndex(n => n.id === node.id);
    if (nodeIndex === -1) {
     return Promise.reject('Node is not part of this Graph.');
    }

    this.nodes.splice(nodeIndex, 1);
    this.links
      .filter(link => link.source.id === node.id || link.target.id === node.id)
      .forEach(link => {
          const linkIndex = this.links.indexOf(link, 0);
          this.links.splice(linkIndex, 1);
      });

    return Promise.resolve();
  }

  public removeLink(link: Link): Promise<void> {
    const linkIndex = this.links.findIndex(l => l.source.id === link.source.id && l.target.id === link.target.id);
    if (linkIndex === -1) {
      return Promise.reject('Link is not part of this Graph.');
    }

    this.links.splice(linkIndex, 1);
    return Promise.resolve();
  }
}
