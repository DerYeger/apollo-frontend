import { Feedback } from '../model/api/model-checker-request';
import { GraphCollection } from '../model/domain/graph.collection';

/**
 * The state of this app.
 */
export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
  graphStore: GraphCollection;
  graphCache: GraphCollection;
}

/**
 * Type of available languages.
 */
export type Language = 'en' | 'de';

/**
 * Type of available themes.
 */
export type Theme = 'dark-theme' | 'light-theme';

/**
 * The settings of this app.
 */
export interface Settings {
  language?: Language;
  sidebar: boolean;
  theme: Theme;
  selectedFeedback: Feedback;
}

/**
 * The settings of the GraphComponent.
 */
export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
