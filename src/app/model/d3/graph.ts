import { FOLLink, GramoFOLink } from './link';
import { FOLNode, GramoFONode } from './node';

export default class Graph {
  public nodes: FOLNode[] = [];
  public links: FOLLink[] = [];

  public createNode(id: string, relations?: string[], constants?: string[], x?: number, y?: number): Promise<FOLNode> {
    if (this.nodes.some((n) => n.id === id)) {
      return Promise.reject('ID already in use.');
    }

    const node = new GramoFONode(id, relations, constants, x, y);
    this.nodes.push(node);
    return Promise.resolve(node);
  }

  public createLink(source: FOLNode, target: FOLNode, relations?: string[], functions?: string[]): Promise<FOLLink> {
    if (this.links.some((l) => l.source.id === source.id && l.target.id === target.id)) {
      return Promise.reject('Link already exists.');
    }

    const link = new GramoFOLink(source, target, relations, functions);
    this.links.push(link);
    return Promise.resolve(link);
  }

  public removeNode(node: FOLNode): Promise<[FOLNode, FOLLink[]]> {
    const nodeIndex = this.nodes.findIndex((n) => n.id === node.id);
    if (nodeIndex === -1) {
      return Promise.reject('Node is not part of this Graph.');
    }

    this.nodes.splice(nodeIndex, 1);
    const attachedLinks = this.links.filter((link) => link.source.id === node.id || link.target.id === node.id);
    attachedLinks.forEach((link) => {
      const linkIndex = this.links.indexOf(link, 0);
      this.links.splice(linkIndex, 1);
    });

    return Promise.resolve([node, attachedLinks]);
  }

  public removeLink(link: FOLLink): Promise<FOLLink> {
    const linkIndex = this.links.findIndex((l) => l.source.id === link.source.id && l.target.id === link.target.id);
    if (linkIndex === -1) {
      return Promise.reject('Link is not part of this Graph.');
    }

    this.links.splice(linkIndex, 1);
    return Promise.resolve(link);
  }
}
