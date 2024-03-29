import { createAction, props } from '@ngrx/store';

import { Assignment } from 'src/app/model/api/assignment';
import { Feedback } from 'src/app/model/api/model-checker-request';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { Language } from 'src/app/store/state';

// Settings

/**
 * Sets the language to the given value.
 */
export const setLanguage = createAction('[settings.language] set', props<{ language: Language }>());

/**
 * Sets the state of the sidebar to expanded or collapsed.
 */
export const setSidebar = createAction('[settings.sidebar] set', props<{ expanded: boolean }>());

/**
 * Toggles the state of the sidebar between expanded and collapsed.
 */
export const toggleSidebar = createAction('[settings.sidebar] toggle');

/**
 * Toggles the theme between dark- and light-mode.
 */
export const toggleTheme = createAction('[settings.theme] toggle');

/**
 * Sets the selected feedback to the given value.
 */
export const setSelectedFeedback = createAction('[settings.selectedFeedback] set', props<{ feedback: Feedback }>());

// Assignments

/**
 * Saves the given assignment to the store.
 */
export const storeAssignment = createAction('[assignments] store', props<Assignment>());

/**
 * Removes the assignment with the given key from the store.
 */
export const removeAssignmentFromStore = createAction('[assignments] remove', props<{ key: string }>());

/**
 * Removed all assignments from the store.
 */
export const clearAssignmentStore = createAction('[assignments] clear');

/**
 * Marks the assignment with the specified key as completed
 */
export const markAssignmentAsCompleted = createAction('[assignments] complete', props<{ key: string }>());

// GraphSettings

/**
 * Enables the simulation of the GraphComponent.
 */
export const enableSimulation = createAction('[graph.simulation] enable');

/**
 * Toggles the simulation of the GraphComponent.
 */
export const toggleSimulation = createAction('[graph.simulation] toggle');

/**
 * Toggles the labels of the GraphComponent.
 */
export const toggleLabels = createAction('[graph.labels] toggle');

// GraphStore

/**
 * Saves the given graph to the store.
 */
export const storeGraph = createAction('[graphStore] store', props<FOLGraph>());

/**
 * Removes the graph with the given key from the store.
 */
export const removeGraphFromStore = createAction('[graphStore] remove', props<{ key: string }>());

/**
 * Removed all graphs from the store.
 */
export const clearGraphStore = createAction('[graphStore] clear');

// GraphCache

/**
 * Caches the given graph.
 */
export const cacheGraph = createAction('[graphCache] cache', props<FOLGraph>());

/**
 * Removes the graph with the given key from the cache.
 */
export const removeGraphFromCache = createAction('[graphCache] remove', props<{ key: string }>());

/**
 * Removes all graphs from the cache.
 */
export const clearGraphCache = createAction('[graphCache] clear');
