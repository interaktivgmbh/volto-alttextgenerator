/**
 * Edit image block.
 * @module components/manage/Blocks/Image/Edit
 */

import React from 'react';
import cx from 'classnames';
import ImageSidebar from '@plone/volto/components/manage/Blocks/Image/ImageSidebar';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import config from '@plone/volto/registry';

import { ImageInput } from '@plone/volto/components/manage/Widgets/ImageWidget';

// INTERAKTIV START
import {
  constructContext,
  getAltTextFromBlock,
  postUploadHandler,
} from '@interaktivgmbh/volto-alttextgenerator/helpers';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
// END

function Edit(props) {
  const { data } = props;
  // INTERAKTIV START
  const intl = useIntl();
  const dispatch = useDispatch();
  // END
  const Image = config.getComponent({ name: 'Image' }).component;

  const handleChange = React.useCallback(
    async (id, image, item = {}) => {
      const url = image ? image['@id'] || image : '';

      props.onChangeBlock(props.block, {
        ...props.data,
        url: flattenToAppURL(url),
        // INTERAKTIV START
        image_field: item.image_field,
        image_scales: item.image_scales,
        alt: item.alt || props.data.alt || '',
        alt_ai_generated: item.alt_ai_generated || false,
        model_used: item.model_used,
        generation_date: item.generation_date,
        // END
      });
    },
    [props],
  );

  // INTERAKTIV START
  const doGenerateAltText = React.useCallback(
    (res) => {
      // avoid stale closure
      const newData = {
        ...data,
        url: flattenToAppURL(res['@id']),
        image_field: 'image',
        image_scales: { image: [res.image] },
      };
      let context = constructContext(
        {
          onChangeBlock: props.onChangeBlock,
          block: props.block,
          data: newData,
        },
        dispatch,
        intl,
      );
      postUploadHandler(context, res);
    },
    [props.onChangeBlock, props.block, data, dispatch, intl],
  );
  // END

  return (
    <>
      <div
        className={cx(
          'block image align',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        {data.url ? (
          <Image
            className={cx({
              'full-width': data.align === 'full',
              large: data.size === 'l',
              medium: data.size === 'm',
              small: data.size === 's',
            })}
            item={
              data.image_scales
                ? {
                    '@id': data.url,
                    image_field: data.image_field,
                    image_scales: data.image_scales,
                  }
                : undefined
            }
            src={
              data.image_scales
                ? undefined
                : isInternalURL(data.url)
                  ? // Backwards compat in the case that the block is storing the full server URL
                    (() => {
                      if (data.size === 'l')
                        return `${flattenToAppURL(data.url)}/@@images/image`;
                      if (data.size === 'm')
                        return `${flattenToAppURL(
                          data.url,
                        )}/@@images/image/preview`;
                      if (data.size === 's')
                        return `${flattenToAppURL(data.url)}/@@images/image/mini`;
                      return `${flattenToAppURL(data.url)}/@@images/image`;
                    })()
                  : data.url
            }
            sizes={config.blocks.blocksConfig.image.getSizes(data)}
            // INTERAKTIV START
            alt={getAltTextFromBlock(data, intl)}
            // END
            loading="lazy"
            responsive={true}
          />
        ) : (
          <ImageInput
            onChange={handleChange}
            // INTERAKTIV START
            generateAltText={doGenerateAltText}
            // END
            placeholderLinkInput={data.placeholder}
            block={props.block}
            id={props.block}
            objectBrowserPickerType={'image'}
          />
        )}
        <SidebarPortal selected={props.selected}>
          <ImageSidebar {...props} />
        </SidebarPortal>
      </div>
    </>
  );
}

export default withBlockExtensions(Edit);
