import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AssignmentCollection, completeAssignment, setAssignment, unsetAssignment } from 'src/app/model/domain/assignment-collection';
import { exampleGraph } from 'src/app/model/domain/example-graph';
import { GraphCollection, setGraph, unsetGraph } from 'src/app/model/domain/graph.collection';
import {
  cacheGraph,
  clearAssignmentStore,
  clearGraphCache,
  clearGraphStore,
  enableSimulation,
  markAssignmentAsCompleted,
  removeAssignmentFromStore,
  removeGraphFromCache,
  removeGraphFromStore,
  setLanguage,
  setSelectedFeedback,
  setSidebar,
  storeAssignment,
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
    on(setSelectedFeedback, (state, { feedback }) => ({ ...state, selectedFeedback: feedback })),
  ),
  assignments: createReducer<AssignmentCollection>(
    {},
    on(storeAssignment, (state, assignment) => setAssignment(state, assignment)),
    on(removeAssignmentFromStore, (state, { key }) => unsetAssignment(state, key)),
    on(markAssignmentAsCompleted, (state, { key }) => completeAssignment(state, key)),
    on(clearAssignmentStore, (_) => ({})),
  ),
  graphSettings: createReducer<GraphSettings>(
    {
      enableSimulation: true,
      showLabels: true,
    },
    on(enableSimulation, (state) => ({ ...state, enableSimulation: true })),
    on(toggleSimulation, (state) => ({ ...state, enableSimulation: !state.enableSimulation })),
    on(toggleLabels, (state) => ({ ...state, showLabels: !state.showLabels })),
  ),
  graphStore: createReducer<GraphCollection>(
    {},
    on(storeGraph, (state, graph) => setGraph(state, graph)),
    on(removeGraphFromStore, (state, { key }) => unsetGraph(state, key)),
    on(clearGraphStore, (_) => ({})),
  ),
  graphCache: createReducer<GraphCollection>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { [exampleGraph.name]: exampleGraph },
    on(cacheGraph, (state, graph) => setGraph(state, graph)),
    on(removeGraphFromCache, (state, { key }) => unsetGraph(state, key)),
    on(clearGraphCache, (_) => ({})),
  ),
};

const sessionOnly: (keyof typeof reducers)[] = ['graphCache'];

/**
 * Meta-reducers.
 * Configured to store the state in the localStorage, excluding fields names 'cache'.
 */
export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers).filter((key) => !sessionOnly.includes(key as keyof typeof reducers)),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
