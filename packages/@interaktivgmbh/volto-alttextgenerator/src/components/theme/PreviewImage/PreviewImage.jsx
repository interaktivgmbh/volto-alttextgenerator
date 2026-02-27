import PropTypes from 'prop-types';

import config from '@plone/volto/registry';
// INTERAKTIV START
import { useIntl } from 'react-intl';
import { getAltTextFromObject } from '@interaktivgmbh/volto-alttextgenerator/helpers';
// END

import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';

/**
 * Renders a preview image for a catalog brain result item.
 */
function PreviewImage({ item, alt, image_field, showDefault = true, ...rest }) {
  // INTERAKTIV START
  const intl = useIntl();
  // END
  const Image = config.getComponent({ name: 'Image' }).component;

  // INTERAKTIV START
  const altText = alt || getAltTextFromObject(item, intl);
  // END

  const image = (
    <Image
      item={item}
      image_field={image_field || item.image_field}
      // INTERAKTIV START
      alt={altText}
      // END
      {...rest}
    />
  );

  if (!image && !showDefault) return null;

  if (image_field || item?.image_field) {
    return image;
  } else {
    return (
      <img
        src={
          config.getComponent({
            name: 'DefaultImage',
            dependencies: ['listing', 'summary'],
          }).component || DefaultImageSVG
        }
        // INTERAKTIV START
        alt={altText}
        // END
        {...rest}
        width="400"
        height="300"
      />
    );
  }
}

PreviewImage.propTypes = {
  item: PropTypes.shape({
    '@id': PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image_field: PropTypes.string,
    image_scales: PropTypes.object,
    showDefault: PropTypes.bool,
    // INTERAKTIV START
    alt_text: PropTypes.string,
    // END
  }),
  alt: PropTypes.string.isRequired,
};

export default PreviewImage;
