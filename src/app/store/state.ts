import { GraphCollection } from '../model/domain/graph.collection';

export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
  graphStore: GraphCollection;
  graphCache: GraphCollection;
}

export type Language = 'en' | 'de';
export type Theme = 'dark-theme' | 'light-theme';

export interface Settings {
  language?: Language;
  sidebar: boolean;
  theme: Theme;
  minimizeResult: boolean;
}

export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
