export interface State {
  settings: Settings;
  graphSettings: GraphSettings;
}

export interface Settings {
  language?: string;
}

export interface GraphSettings {
  enableSimulation: boolean;
  showLabels: boolean;
}
