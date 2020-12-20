import { GraphCollection } from '../model/domain/graph.collection';

export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
  graphStore: GraphCollection;
  graphCache: GraphCollection;
}

export declare type Theme = 'dark-theme' | 'light-theme';

export interface Settings {
  language?: string;
  sidebar: boolean;
  theme: Theme;
}

export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
