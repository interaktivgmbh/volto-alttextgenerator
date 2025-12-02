import { PATCH_ALT_TEXT_SUGGESTION } from 'volto-interaktiv-alttextgenerator/constants/ActionTypes';

export function updateAltTextSuggestion(path: string) {
  return {
    type: PATCH_ALT_TEXT_SUGGESTION,
    request: {
      op: 'patch',
      path: `${path}/@alt_text_suggestion`,
      data: { path },
    }
  };
}
