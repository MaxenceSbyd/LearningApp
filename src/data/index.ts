import { fr } from './fr';
import { ja } from './ja';
import type { LangCode, LanguagePack } from '../types';

export const packs: Record<LangCode, LanguagePack> = { fr, ja };

export function getPack(code: LangCode): LanguagePack {
  return packs[code];
}
