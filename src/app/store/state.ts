import { GraphCollection } from '../model/domain/graph.collection';

export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
  graphStore: GraphCollection;
  graphCache: GraphCollection;
}

export declare type Language = 'en' | 'de';
export declare type Theme = 'dark-theme' | 'light-theme';

export interface Settings {
  language?: Language;
  sidebar: boolean;
  theme: Theme;
}

export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
