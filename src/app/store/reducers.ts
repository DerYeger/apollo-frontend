import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { exampleGraph } from 'src/app/model/domain/example-graph';
import { GraphCollection, setGraph, unsetGraph } from 'src/app/model/domain/graph.collection';
import {
  cacheGraph,
  clearGraphCache,
  clearGraphStore,
  enableSimulation,
  removeGraphFromCache,
  removeGraphFromStore,
  setLanguage,
  setSelectedFeedback,
  setSidebar,
  storeGraph,
  toggleLabels,
  toggleSidebar,
  toggleSimulation,
  toggleTheme,
} from 'src/app/store/actions';
import { GraphSettings, Settings, State } from 'src/app/store/state';

/**
 * Reducers for the app-state.
 */
export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { language: undefined, sidebar: true, theme: 'dark-theme', selectedFeedback: 'relevant' },
    on(setLanguage, (state, { language }) => ({ ...state, language })),
    on(setSidebar, (state, { expanded }) => ({ ...state, sidebar: expanded })),
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { 'Example Graph': exampleGraph },
    on(cacheGraph, (state, graph) => setGraph(state, graph)),
    on(removeGraphFromCache, (state, { key }) => unsetGraph(state, key)),
    on(clearGraphCache, (_) => ({}))
  ),
};

/**
 * Meta-reducers.
 * Configured to store the state in the localStorage, excluding fields names 'cache'.
 */
export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers).filter((key) => !key.toLowerCase().includes('cache')),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
