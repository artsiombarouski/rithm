import { isImageMimeType } from '../../mime-utils';
import { FileMetadata } from '../../types';
import { useRetry } from '../hooks';
import { Image, Text, View } from 'native-base';
import React, { Fragment, useState } from 'react';

export type FileContentViewProps = {
  type?: string;
  url?: string;
  name?: string;
  thumbnailUrl?: string;
  metadata?: FileMetadata;
  maxRetryCount?: number;
};

export const FileContentView = (props: FileContentViewProps) => {
  const { type, url, name, thumbnailUrl, maxRetryCount, metadata } = props;
  const { retry, retryCount } = useRetry({ maxRetryCount });
  const [show, setShow] = useState(false);

  return (
    <Fragment key={`retry-${retryCount}`}>
      {isImageMimeType(type) ? (
        <Image
          key={`image-retry-count-${retryCount}`}
          style={{ flex: 1 }}
          resizeMode={'cover'}
          source={{
            uri: thumbnailUrl ?? url,
            cache: retryCount > 1 ? 'reload' : undefined,
          }}
          onError={retry}
        />
      ) : thumbnailUrl ? (
        <Image
          key={`thumbnail-retry-count-${retryCount}`}
          style={{ flex: 1, display: show ? 'flex' : 'none' }}
          source={{
            uri: thumbnailUrl,
            cache: retryCount > 1 ? 'reload' : undefined,
          }}
          resizeMode={'cover'}
          onError={retry}
          onLoad={() => setShow(true)}
        />
      ) : (
        <View flex={1}>
          <Text flex={1} numberOfLines={1}>
            {name ?? url ?? ''}
          </Text>
        </View>
      )}
    </Fragment>
  );
};
