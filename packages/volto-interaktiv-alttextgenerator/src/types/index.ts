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

export type AltTextSuggestionAction = Action<
  AltTextSuggestionActionRequestData
>;

export interface ImageContextProps {
  onChangeBlock: Function;
  updateAltTextSuggestion: Function;
  block: object;
  data: object;
  intl: any;
}

export interface ImageContext {
  props: ImageContextProps;
}

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
