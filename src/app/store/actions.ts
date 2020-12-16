import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction('[settings.language] set', props<{ language: string }>());

export const enableSimulation = createAction('[graph.simulation] enable');
export const toggleSimulation = createAction('[graph.simulation] toggle');
export const toggleLabels = createAction('[graph.labels] toggle');
