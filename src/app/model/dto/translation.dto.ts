/**
 * DTO for translation keys and their parameters.
 */
export interface TranslationDTO {
  key: string;
  params?: Record<string, string>;
}
