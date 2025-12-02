import React from 'react';
import { toast } from 'react-toastify';

import { flattenToAppURL } from '@plone/volto/helpers';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import addonMessages from 'volto-interaktiv-alttextgenerator/messages';

export const getAltTextFromBlock = (data) => {
  if (!data.alt) return '';

  let altText = data.alt;

  if (data.alt_ai_generated) {
    altText += `(${data.model_used}, ${data.generation_date})`
  }

  return altText;
}

export const getAltTextFromObject = (data) => {
  if (!data.alt_text) return '';

  let altText = data.alt_text;

  if (data.alt_text_ai_generated) {
    altText += `(${data.alt_text_model_used}, ${data.alt_text_generation_date})`
  }

  return altText;
}

private const getErrorMessage = (status) => {
  switch(status) {
    case 409:
      return addonMessages.altTextGenNotAllowed
    default:
      return addonMessages.altTextGenErrorLabel
  }
}

export const showInfoToast = (title, content) => {
  toast.info(
    <Toast
      info
      title={title}
      content={content}
    />,
  )
}

export const showErrorToast = (title, content) => {
  toast.error(
    <Toast
      error
      title={title}
      content={content}
    />,
  )
}

export const showSuccessToast = (title, content) => {
  toast.success(
    <Toast
      success
      title={title}
      content={content}
    />,
  )
}

private const onSuccess = (context, res) => {
  context.props.onChangeBlock(context.props.block, {
    ...context.props.data,
    alt: res.alt_text,
    alt_ai_generated: res.alt_text_ai_generated,
    model_used: res.alt_text_model_used,
    generation_date: res.alt_text_generation_date,
  });

  showSuccessToast(
    context.props.intl.formatMessage(addonMessages.altTextGenSuccessTitle),
    context.props.intl.formatMessage(addonMessages.altTextGenSuccessLabel),
  )
}

private const onError = (context, res) => {
  const errorMessage = getErrorMessage(res.status);

  showErrorToast(
    context.props.intl.formatMessage(addonMessages.altTextGenErrorTitle),
    context.props.intl.formatMessage(errorMessage),
  )
}

/**
 * Post-upload handler that will generate an alternative text for the image.
 * @param {any} context The class component context containing the props.
 * @param {object} res The result from the resolved createContent(...) Promise.
 * @returns {undefined}
 */
export const postUploadHandler = (context, res)=> {
  const contentUrl = flattenToAppURL(res['@id']);
  showInfoToast(
    undefined,
    context.props.intl.formatMessage(addonMessages.altTextGenStartLabel),
  );

  context.props.updateAltTextSuggestion(contentUrl)
    .then((data) => onSuccess(context, data))
    .catch((err) => onError(context, err));
}
