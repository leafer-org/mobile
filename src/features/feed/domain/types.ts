export type AgeGroup = 'adults' | 'children';

export type FeedParams = {
  cityId: string;
  ageGroup: AgeGroup;
  lat?: number;
  lng?: number;
};

export type ResolvedImageMedia = {
  type: 'image';
  mediaId: string;
  preview?: { url: string };
};

export type ResolvedVideoMedia = {
  type: 'video';
  mediaId: string;
  preview?: {
    thumbnailUrl: string | null;
    hlsUrl: string | null;
    mp4PreviewUrl: string | null;
    processingStatus: 'pending' | 'processing' | 'ready' | 'failed';
    progress: number | null;
  };
};

export type ResolvedMediaItem = ResolvedImageMedia | ResolvedVideoMedia;

export type PaymentOption = {
  name: string;
  description: string | null;
  strategy: 'free' | 'one-time' | 'subscription';
  price: number | null;
};

export type ItemListView = {
  itemId: string;
  typeId: string;
  title: string;
  description: string | null;
  media: ResolvedMediaItem[];
  hasVideo: boolean;
  price: { options: PaymentOption[] } | null;
  rating: number | null;
  reviewCount: number;
  owner: { name: string; avatarId: string | null; avatarUrl: string | null } | null;
  location: { cityId: string; address: string | null } | null;
  categoryIds: string[];
};
