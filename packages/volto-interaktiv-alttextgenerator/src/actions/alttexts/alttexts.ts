import { PATCH_ALT_TEXT_SUGGESTION } from 'volto-interaktiv-alttextgenerator/constants/ActionTypes';
import type { AltTextSuggestionAction } from 'volto-interaktiv-alttextgenerator/types';

export function updateAltTextSuggestion(path: string): AltTextSuggestionAction {
  return {
    type: PATCH_ALT_TEXT_SUGGESTION,
    request: {
      op: 'patch',
      path: `${path}/@alt_text_suggestion`,
      data: { path },
    },
  };
}
