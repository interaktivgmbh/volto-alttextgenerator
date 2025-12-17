import React from 'react';
import PropTypes from 'prop-types';

import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
// INTERAKTIV START
import { useIntl } from 'react-intl';
import { getAltTextFromObject } from '@interaktivgmbh/volto-alttextgenerator/helpers';
// END

import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';

/**
 * Renders a preview image for a catalog brain result item.
 *
 */
function PreviewImage(props) {
  const { item, size = 'preview', alt, ...rest } = props;
  // INTERAKTIV START
  const intl = useIntl();
  // END
  const src = item.image_field
    ? flattenToAppURL(`${item['@id']}/@@images/${item.image_field}/${size}`)
    : config.getComponent({
        name: 'DefaultImage',
        dependencies: ['listing', 'summary'],
      }).component || DefaultImageSVG;

  // INTERAKTIV START
  const altText = alt || getAltTextFromObject(item, intl);
  // END

  return (
    <img src={src} alt={/* INTERAKTIV START */ altText /* END */} {...rest} />
  );
}

PreviewImage.propTypes = {
  size: PropTypes.string,
  item: PropTypes.shape({
    '@id': PropTypes.string.isRequired,
    image_field: PropTypes.string,
    title: PropTypes.string.isRequired,
    // INTERAKTIV START
    alt_text: PropTypes.string,
    // END
  }),
};

export default PreviewImage;
