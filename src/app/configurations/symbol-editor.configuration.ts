export interface SymbolEditorConfiguration {
  title: string;
  placeholder: string;
}

export const RELATION_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.relation.plural',
  placeholder: 'editor.symbols.new-relation'
};

export const FUNCTION_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.function.plural',
  placeholder: 'editor.symbols.new-function',
};

export const CONSTANT_SYMBOL_EDITOR_CONFIGURATION: SymbolEditorConfiguration = {
  title: 'fol.constant.plural',
  placeholder: 'editor.symbols.new-constant',
};
