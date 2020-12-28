export interface TranslationDTO {
  key: string;
  params?: object;
}

export function instanceOfTranslationDTO(object: any): object is TranslationDTO {
  return 'key' in object;
}
