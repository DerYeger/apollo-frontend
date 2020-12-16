import { createAction, props } from '@ngrx/store';

import { FOLGraph } from '../model/domain/fol.graph';

export const setLanguage = createAction('[settings.language] set', props<{ language: string }>());

export const enableSimulation = createAction('[graph.simulation] enable');
export const toggleSimulation = createAction('[graph.simulation] toggle');
export const toggleLabels = createAction('[graph.labels] toggle');

export const storeGraph = createAction('[graphStore] store', props<{ key: string; graph: FOLGraph }>());
export const removeGraphFromStore = createAction('[graphStore] remove', props<{ key: string }>());
export const clearGraphStore = createAction('[graphStore] clear');

export const cacheGraph = createAction('[graphCache] cache', props<{ key: string; graph: FOLGraph }>());
export const removeGraphFromCache = createAction('[graphCache] remove', props<{ key: string }>());
export const clearGraphCache = createAction('[graphCache] clear');
