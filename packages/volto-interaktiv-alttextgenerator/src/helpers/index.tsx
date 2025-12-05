import React from 'react';
import { toast } from 'react-toastify';

import { flattenToAppURL } from '@plone/volto/helpers';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import addonMessages from 'volto-interaktiv-alttextgenerator/messages';

interface ImageContextProps {
  onChangeBlock: Function;
  updateAltTextSuggestion: Function;
  block: object;
  data: object;
  intl: any;
}

interface ImageContext {
  props: ImageContextProps;
}

interface Message {
  id: string;
  defaultMessage: string;
}

interface ImageBlockData {
  alt: string;
  alt_ai_generated: boolean;
  model_used?: string;
  generation_date?: string;
}

interface ImageObjectData {
  "@id": string;
  alt_text?: string;
  alt_text_ai_generated: boolean;
  alt_text_model_used?: string;
  alt_text_generation_date?: string;
}

interface ErrorResponse {
  status: number;
}

/**
 * Constructs the alternative text for an image from its block data.
 * If the alternative text is generated using AI, this will append the
 * model used for generation, as well as the generation date.
 */
export const getAltTextFromBlock = (data: ImageBlockData): string => {
  if (!data?.alt) return '';

  let altText = data.alt;

  if (data.alt_ai_generated && data.model_used) {
    const altTextMetadata = [data.model_used];

    if (data.generation_date) {
      altTextMetadata.push(data.generation_date);
    }

    altText += ` (${altTextMetadata.join(', ')})`;
  }

  return altText;
}

/**
 * Constructs the alternative text for an image from its object data.
 * The object data is returned when querying an image from the backend.
 * If the alternative text is generated using AI, this will append the
 * model used for generation, as well as the generation date.
 */
export const getAltTextFromObject = (data: ImageObjectData): string => {
  if (!data?.alt_text) return '';

  let altText = data.alt_text;

  if (data.alt_text_ai_generated && data.alt_text_model_used) {
    const altTextMetadata = [data.alt_text_model_used];

    if (data.alt_text_generation_date) {
      altTextMetadata.push(data.alt_text_generation_date);
    }

    altText += ` (${altTextMetadata.join(', ')})`;
  }

  return altText;
}

const getErrorMessage = (status: number): Message => {
  switch(status) {
    case 409:
      return addonMessages.altTextGenNotAllowed
    default:
      return addonMessages.altTextGenErrorLabel
  }
}

export const showInfoToast = (title: string, content: string): void => {
  toast.info(
    <Toast
      info
      title={title}
      content={content}
    />,
  )
}

export const showErrorToast = (title: string, content: string): void => {
  toast.error(
    <Toast
      error
      title={title}
      content={content}
    />,
  )
}

export const showSuccessToast = (title: string, content: string): void => {
  toast.success(
    <Toast
      success
      title={title}
      content={content}
    />,
  )
}

const onSuccess = (
  context: ImageContext,
  res: ImageObjectData,
  silent: boolean
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
    )
  }
}

const onError = (
  context: ImageContext,
  res: ErrorResponse,
  silent: boolean
): void => {
  const errorMessage = getErrorMessage(res.status);

  if (!silent) {
    showErrorToast(
      context.props.intl.formatMessage(addonMessages.altTextGenErrorTitle),
      context.props.intl.formatMessage(errorMessage),
    )
  }
}

/**
 * Post-upload handler that will generate an alternative text for the image.
 * @returns {undefined}
 */
export const postUploadHandler = (
  context: ImageContext,
  res: ImageObjectData,
  silent: boolean = false
): void => {
  const contentUrl: string = flattenToAppURL(res['@id']);

  if (!silent) {
    showInfoToast(
      undefined,
      context.props.intl.formatMessage(addonMessages.altTextGenStartLabel),
    );
  }

  context.props.updateAltTextSuggestion(contentUrl)
    .then((data: ImageObjectData) => onSuccess(context, data, silent))
    .catch((err: ErrorResponse) => onError(context, err, silent));
}
