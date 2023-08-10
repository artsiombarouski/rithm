import { FileMetadata } from '../types';

export type StoredFile = {
  key: string;
  url?: string;
  thumbnailUrl?: string;
  type?: string;
  name?: string;
  metadata?: FileMetadata;
};
