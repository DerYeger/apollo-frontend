import { GraphCollection } from '../model/domain/graph.collection';

export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
  graphStore: GraphCollection;
  graphCache: GraphCollection;
}

export interface Settings {
  language?: string;
}

export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
