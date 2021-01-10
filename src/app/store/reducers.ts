import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { GraphCollection, setGraph, unsetGraph } from '../model/domain/graph.collection';
import {
  cacheGraph,
  clearGraphCache,
  clearGraphStore,
  enableSimulation,
  removeGraphFromCache,
  removeGraphFromStore,
  setLanguage,
  setSelectedFeedback,
  storeGraph,
  toggleLabels,
  toggleSidebar,
  toggleSimulation,
  toggleTheme,
} from './actions';
import { GraphSettings, Settings, State } from './state';

export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { language: undefined, sidebar: true, theme: 'dark-theme', selectedFeedback: 'relevant' },
    on(setLanguage, (state, { language }) => ({ ...state, language })),
    on(toggleSidebar, (state) => ({ ...state, sidebar: !state.sidebar })),
    on(toggleTheme, (state) => ({ ...state, theme: state.theme === 'dark-theme' ? 'light-theme' : 'dark-theme' })),
    on(setSelectedFeedback, (state, { feedback }) => ({ ...state, selectedFeedback: feedback }))
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
  graphStore: createReducer<GraphCollection>(
    {},
    on(storeGraph, (state, graph) => setGraph(state, graph)),
    on(removeGraphFromStore, (state, { key }) => unsetGraph(state, key)),
    on(clearGraphStore, (_) => ({}))
  ),
  graphCache: createReducer<GraphCollection>(
    {},
    on(cacheGraph, (state, graph) => setGraph(state, graph)),
    on(removeGraphFromCache, (state, { key }) => unsetGraph(state, key)),
    on(clearGraphCache, (_) => ({}))
  ),
};

export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers).filter((key) => !key.toLowerCase().includes('cache')),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
