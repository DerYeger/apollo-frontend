import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { setLanguage } from './actions';
import { Settings, State } from './state';

export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { language: undefined },
    on(setLanguage, (state, { language }) => ({...state, language}))
  )
};

export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers),
    rehydrate: true,
    removeOnUndefined: true
  })
];
