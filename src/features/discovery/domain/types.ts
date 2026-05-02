import type { components } from '@/kernel/api/schema';
import type { ResolvedMediaItem } from '@/support/media';

export type { ResolvedImageMedia, ResolvedMediaItem, ResolvedVideoMedia } from '@/support/media';

export type CategoryListView = components['schemas']['CategoryListItem'];

export type AgeGroup = 'adults' | 'children';

export type FeedParams = {
  cityId: string;
  ageGroup: AgeGroup;
  lat?: number;
  lng?: number;
};

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
