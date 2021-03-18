import { TranslationDTO } from 'src/app/model/dto/translation.dto';

/**
 * Trace of the ModelChecking algorithm.
 * Includes information about a checked formula and its children.
 */
export interface ModelCheckerTrace {
  formula: string;
  description: TranslationDTO;
  isModel: boolean;
  shouldBeModel: boolean;
  children?: ModelCheckerTrace[];
}
