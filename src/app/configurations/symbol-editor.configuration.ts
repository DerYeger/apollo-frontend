/**
 * Configuration for the SymbolEditorComponent.
 * Defines input validation and translation keys.
 */
export interface SymbolEditorConfiguration {
  title: string;
  placeholder: string;
  symbolPattern: string;
  patternError: string;
}

export const RELATION_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.relation.plural',
  placeholder: 'editor.symbols.new-relation',
  symbolPattern: '[A-Z]+([a-z]|[A-Z])*',
  patternError: 'validation.relation-pattern-error',
};

export const FUNCTION_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.function.plural',
  placeholder: 'editor.symbols.new-function',
  symbolPattern: '[a-z]+([a-z]|[A-Z])*',
  patternError: 'validation.function-pattern-error',
};

export const CONSTANT_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.constant.plural',
  placeholder: 'editor.symbols.new-constant',
  symbolPattern: '[a-z]+([a-z]|[A-Z])*',
  patternError: 'validation.constant-pattern-error',
};
