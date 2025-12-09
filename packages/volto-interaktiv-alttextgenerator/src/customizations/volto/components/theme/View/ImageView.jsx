/**
 * Image view component.
 * @module components/theme/View/ImageView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container as SemanticContainer } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import prettybytes from 'pretty-bytes';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
// INTERAKTIV START
import { useIntl } from 'react-intl';
import { getAltTextFromObject } from 'volto-interaktiv-alttextgenerator/helpers';
// END

/**
 * Image view component class.
 * @function ImageView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const ImageView = ({ content }) => {
  // INTERAKTIV START
  const intl = useIntl();
  // END
  const Container =
    config.getComponent({ name: 'Container' }).component || SemanticContainer;

  return (
    <Container className="view-wrapper">
      <h1 className="documentFirstHeading">
        {content.title}
        {content.subtitle && ` - ${content.subtitle}`}
      </h1>
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content?.image?.download && (
        <a href={flattenToAppURL(content.image.download)}>
          <img
            // INTERAKTIV START
            alt={getAltTextFromObject(content, intl)}
            // END
            src={flattenToAppURL(content.image.scales.preview.download)}
          />
          <figcaption>
            <FormattedMessage
              id="Size: {size}"
              defaultMessage="Size: {size}"
              values={{ size: prettybytes(content.image.size) }}
            />
            &nbsp; &mdash; &nbsp;
            <FormattedMessage
              id="Click to download full sized image"
              defaultMessage="Click to download full sized image"
            />
          </figcaption>
        </a>
      )}
    </Container>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ImageView.propTypes = {
  content: PropTypes.shape({
    // INTERAKTIV START
    alt_text: PropTypes.string,
    alt_text_ai_generated: PropTypes.bool,
    alt_text_model_used: PropTypes.string,
    alt_text_generation_date: PropTypes.string,
    // END
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      scales: PropTypes.shape({
        preview: PropTypes.shape({
          download: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
};

export default ImageView;
