import { Text, View } from 'native-base';
import { FileMetadata } from '../../types';
import { isImageMimeType } from '../../mime-utils';
import { Image } from 'react-native';
import { useRetry } from '../hooks';
import { Fragment } from 'react';

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
          style={{ flex: 1 }}
          resizeMode={'cover'}
          source={{
            uri: thumbnailUrl,
            cache: retryCount > 1 ? 'reload' : undefined,
          }}
          onError={retry}
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
