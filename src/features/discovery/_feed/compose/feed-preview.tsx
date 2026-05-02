import { Fragment } from 'react';

import { ItemCard } from '../../_item-card';
import { useAgeGroup } from '../../model/use-age-group';
import { useCity } from '@/support/city';
import { useLikedStatus } from '../../model/use-like';
import { useFeed } from '../model/use-feed';
import { FeedPreviewLayout } from '../ui/feed-preview-layout';

export function FeedPreview() {
  const { cityId } = useCity();
  const { ageGroup } = useAgeGroup();
  const { items, itemIds, isLoading } = useFeed(cityId, ageGroup);
  const liked = useLikedStatus(itemIds);

  return (
    <FeedPreviewLayout
      items={items}
      isLoading={isLoading}
      renderItem={(item) => (
        <Fragment key={item.itemId}>
          <ItemCard item={item} isLiked={liked.data?.has(item.itemId) ?? false} />
        </Fragment>
      )}
    />
  );
}
