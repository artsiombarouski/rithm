import { Image, Text, View } from 'native-base';
import { FileMetadata } from '../../types';
import { isImageMimeType } from '../../mime-utils';

export type FileContentViewProps = {
  type?: string;
  url?: string;
  name?: string;
  thumbnailUrl?: string;
  metadata?: FileMetadata;
};

export const FileContentView = (props: FileContentViewProps) => {
  const { type, url, name, thumbnailUrl, metadata } = props;
  return (
    <>
      {isImageMimeType(type) ? (
        <Image flex={1} source={{ uri: thumbnailUrl ?? url }} />
      ) : thumbnailUrl ? (
        <Image flex={1} source={{ uri: thumbnailUrl }} />
      ) : (
        <View flex={1}>
          <Text flex={1} numberOfLines={1}>
            {name ?? url ?? ''}
          </Text>
        </View>
      )}
    </>
  );
};
