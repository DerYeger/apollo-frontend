import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { enableSimulation, setLanguage, toggleLabels, toggleSimulation } from './actions';
import { GraphSettings, Settings, State } from './state';

export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { language: undefined },
    on(setLanguage, (state, { language }) => ({ ...state, language }))
  ),
  graphSettings: createReducer<GraphSettings>(
    {
      enableSimulation: true,
      showLabels: true,
    },
    on(enableSimulation, (state) => ({ ...state, enableSimulation: true })),
    on(toggleSimulation, (state) => ({ ...state, enableSimulation: !state.enableSimulation })),
    on(toggleLabels, (state) => ({ ...state, showLabels: !state.showLabels }))
  ),
};

export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
