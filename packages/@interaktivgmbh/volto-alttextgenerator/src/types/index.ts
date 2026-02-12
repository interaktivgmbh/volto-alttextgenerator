export interface ActionRequest<ActionRequestData extends object = object> {
  op: string;
  path: string;
  data?: ActionRequestData;
}

export interface Action<Request extends object = object> {
  type: string;
  request: ActionRequest<Request>;
}

export interface AltTextSuggestionActionRequestData {
  path: string;
}

export type AltTextSuggestionAction =
  Action<AltTextSuggestionActionRequestData>;

export interface Message {
  id: string;
  defaultMessage: string;
}

export interface ImageBlockData {
  alt: string;
  alt_ai_generated: boolean;
  model_used?: string;
  generation_date?: string;
}

export interface ImageObjectData {
  '@id': string;
  alt_text?: string;
  alt_text_ai_generated: boolean;
  alt_text_model_used?: string;
  alt_text_generation_date?: string;
}

export interface ErrorResponse {
  status: number;
}

export type Messages = Record<string, Message>;

export interface ImageBlockProps {
  block: object;
  data: ImageBlockData;
}

export interface FunctionalImageContextProps extends ImageBlockProps {
  onChangeBlock: Function;
}

export interface ImageContextProps extends FunctionalImageContextProps {
  updateAltTextSuggestion: Function;
  intl: any;
}

export interface ImageContext {
  props: ImageContextProps;
}

export interface ObjectBrowserOptions {
  mode: string;
  onSelectItem: Function;
}
