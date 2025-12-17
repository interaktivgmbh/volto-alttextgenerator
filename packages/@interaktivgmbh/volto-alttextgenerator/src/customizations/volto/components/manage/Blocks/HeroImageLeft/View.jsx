/**
 * View image block.
 * @module components/manage/Blocks/Hero/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { LinkMore } from '@plone/volto/components';
// INTERAKTIV START
import { getAltTextFromBlock } from '@interaktivgmbh/volto-alttextgenerator/helpers';
// END

/**
 * View image block class.
 * @class View
 * @extends Component
 */
const View = ({ data, /* INTERAKTIV START */ intl /* END */ }) => (
  <div className="block hero">
    <div className="block-inner-wrapper">
      {data.url && (
        <img
          src={`${flattenToAppURL(data.url)}/@@images/image`}
          // INTERAKTIV START
          alt={getAltTextFromBlock(data, intl)}
          // END
          className="hero-image"
          loading="lazy"
        />
      )}
      <div className="hero-body">
        <div className="hero-text">
          {data.title && <h1>{data.title}</h1>}
          {data.description && <p>{data.description}</p>}
        </div>
        <LinkMore data={data} />
      </div>
    </div>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  // INTERAKTIV START
  intl: PropTypes.any,
  // END
};

export default View;
