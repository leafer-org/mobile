import { useRouter } from 'expo-router';

import { MediaCarousel } from '@/support/media';

import type { ItemListView } from '../../domain/types';
import { useToggleLike } from '../../model/use-like';
import { ItemCardLayout, CARD_WIDTH, MEDIA_HEIGHT } from '../ui/item-card-layout';
import { ItemTitle } from '../ui/item-title';
import { LikeButton } from '../ui/like-button';
import { OwnerName } from '../ui/owner-name';
import { PriceLabel } from '../ui/price-label';
import { RatingBadge } from '../ui/rating-badge';

export function ItemCard({
  item,
  isVisible = true,
  isLiked,
}: {
  item: ItemListView;
  isVisible?: boolean;
  isLiked: boolean;
}) {
  const router = useRouter();
  const { toggle } = useToggleLike(item.itemId);

  return (
    <ItemCardLayout
      testID={`item-card-${item.itemId}`}
      onPress={() => router.push({ pathname: '/(app)/items/[itemId]', params: { itemId: item.itemId } })}
      media={
        <MediaCarousel
          media={item.media}
          isVisible={isVisible}
          width={CARD_WIDTH}
          height={MEDIA_HEIGHT}
        />
      }
      likeButton={<LikeButton isLiked={isLiked} onPress={() => toggle(isLiked)} />}
      title={<ItemTitle title={item.title} />}
      price={<PriceLabel price={item.price} />}
      rating={<RatingBadge rating={item.rating} reviewCount={item.reviewCount} />}
      owner={item.owner ? <OwnerName name={item.owner.name} /> : undefined}
    />
  );
}
