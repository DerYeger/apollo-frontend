import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction('[settings.language] set', props<{ language: string }>());
