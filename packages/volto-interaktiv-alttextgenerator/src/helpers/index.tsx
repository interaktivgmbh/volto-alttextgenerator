import React from 'react';
import { toast } from 'react-toastify';

import { flattenToAppURL } from '@plone/volto/helpers';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import type {
  ImageBlockData,
  ImageObjectData,
  ImageContext,
  ErrorResponse,
  Message,
  ImageContextProps,
  FunctionalImageContextProps,
  ObjectBrowserOptions,
} from 'volto-interaktiv-alttextgenerator/types';
import addonMessages from 'volto-interaktiv-alttextgenerator/messages';
import { updateAltTextSuggestion } from 'volto-interaktiv-alttextgenerator/actions/alttexts/alttexts';

/**
 * Constructs the alternative text for an image from its block data.
 * If the alternative text is generated using AI, this will append the
 * model used for generation, as well as the generation date.
 */
export const getAltTextFromBlock = (data: ImageBlockData, intl): string => {
  if (!data?.alt) return '';

  let altText = data.alt;

  if (data.alt_ai_generated) {
    const altTextMetadata = [];

    if (data.model_used) {
      altTextMetadata.push(data.model_used);
    }

    if (data.generation_date) {
      altTextMetadata.push(data.generation_date);
    }

    altText += ` (${altTextMetadata.length > 0 ? altTextMetadata.join(', ') : intl.formatMessage(addonMessages.altTextIsAIGenerated)})`;
  }

  return altText;
};

/**
 * Constructs the alternative text for an image from its object data.
 * The object data is returned when querying an image from the backend.
 * If the alternative text is generated using AI, this will append the
 * model used for generation, as well as the generation date.
 */
export const getAltTextFromObject = (data: ImageObjectData, intl): string => {
  if (!data?.alt_text) return '';

  let altText = data.alt_text;

  if (data.alt_text_ai_generated) {
    const altTextMetadata = [];

    if (data.alt_text_model_used) {
      altTextMetadata.push(data.alt_text_model_used);
    }

    if (data.alt_text_generation_date) {
      altTextMetadata.push(data.alt_text_generation_date);
    }

    altText += ` (${altTextMetadata.length > 0 ? altTextMetadata.join(', ') : intl.formatMessage(addonMessages.altTextIsAIGenerated)})`;
  }

  return altText;
};

const getErrorMessage = (status: number): Message => {
  switch (status) {
    case 406:
      return addonMessages.altTextGenUnsupported;
    case 409:
      return addonMessages.altTextGenNotAllowed;
    default:
      return addonMessages.altTextGenErrorLabel;
  }
};

export const showInfoToast = (title: string, content: string): void => {
  toast.info(<Toast info title={title} content={content} />);
};

export const showErrorToast = (title: string, content: string): void => {
  toast.error(<Toast error title={title} content={content} />);
};

export const showSuccessToast = (title: string, content: string): void => {
  toast.success(<Toast success title={title} content={content} />);
};

const onSuccess = (
  context: ImageContext,
  res: ImageObjectData,
  silent: boolean,
): void => {
  context.props.onChangeBlock(context.props.block, {
    ...context.props.data,
    alt: res.alt_text,
    alt_ai_generated: res.alt_text_ai_generated,
    model_used: res.alt_text_model_used,
    generation_date: res.alt_text_generation_date,
  });

  if (!silent) {
    showSuccessToast(
      context.props.intl.formatMessage(addonMessages.altTextGenSuccessTitle),
      context.props.intl.formatMessage(addonMessages.altTextGenSuccessLabel),
    );
  }
};

const onError = (
  context: ImageContext,
  res: ErrorResponse,
  silent: boolean,
): void => {
  const errorMessage = getErrorMessage(res.status);

  if (!silent) {
    showErrorToast(
      context.props.intl.formatMessage(addonMessages.altTextGenErrorTitle),
      context.props.intl.formatMessage(errorMessage),
    );
  }
};

/**
 * Post-upload handler that will generate an alternative text for the image.
 */
export const postUploadHandler = (
  context: ImageContext,
  res: ImageObjectData,
  silent: boolean = false,
): void => {
  const contentUrl: string = flattenToAppURL(res['@id']);

  if (!silent) {
    showInfoToast(
      undefined,
      context.props.intl.formatMessage(addonMessages.altTextGenStartLabel),
    );
  }

  context.props
    .updateAltTextSuggestion(contentUrl)
    .then((data: ImageObjectData) => onSuccess(context, data, silent))
    .catch((err: ErrorResponse) => onError(context, err, silent));
};

/**
 * Constructs a context for functional components to be used in the postUploadHandler.
 */
export const constructContext = (
  props: FunctionalImageContextProps,
  dispatch: Function,
  intl: any,
): ImageContext => {
  const contextProps: ImageContextProps = {
    ...props,
    updateAltTextSuggestion: (path: string): Promise<ImageObjectData> =>
      dispatch(updateAltTextSuggestion(path)),
    intl,
  };

  return { props: contextProps };
};

export const getObjectBrowserOptions = (
  props: FunctionalImageContextProps,
): ObjectBrowserOptions => {
  return {
    mode: 'image',
    onSelectItem: (url: string, item: ImageObjectData) => {
      const aiGenerated = item.alt_text_ai_generated;

      const additionalData = aiGenerated
        ? {
            model_used: item.alt_text_model_used,
            generation_date: item.alt_text_generation_date,
          }
        : {};

      props.onChangeBlock(props.block, {
        ...props.data,
        alt: item.alt_text ?? '',
        alt_ai_generated: aiGenerated,
        ...additionalData,
        url,
      });
    },
  };
};
