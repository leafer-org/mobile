import { useRouter } from 'expo-router';

import { MediaCarousel } from '@/support/media';

import type { ItemListView } from '../../domain/types';
import { useToggleLike } from '@/support/like';
import { AddressLabel } from '../ui/address-label';
import { AgeGroupBadge } from '../ui/age-group-badge';
import { EventDateLabel } from '../ui/event-date-label';
import { ItemCardLayout, CARD_WIDTH, MEDIA_HEIGHT } from '../ui/item-card-layout';
import { ItemTitle } from '../ui/item-title';
import { LikeButton } from '../ui/like-button';
import { OwnerName } from '../ui/owner-name';
import { PriceLabel } from '../ui/price-label';
import { RatingBadge } from '../ui/rating-badge';
import { ScheduleSlotLabel } from '../ui/schedule-slot-label';

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

  // event-date-time приоритетнее: если есть ближайшая дата — показываем её,
  // иначе ближайший слот расписания. Оба сразу не нужны — карточка станет шумной.
  const whenLabel = item.eventDateTime
    ? <EventDateLabel iso={item.eventDateTime} />
    : item.nextScheduleSlot
      ? <ScheduleSlotLabel slot={item.nextScheduleSlot} />
      : undefined;

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
      ageGroup={item.cardAgeGroup ? <AgeGroupBadge ageGroup={item.cardAgeGroup} /> : undefined}
      title={<ItemTitle title={item.title} />}
      whenLabel={whenLabel}
      price={<PriceLabel price={item.price} />}
      rating={<RatingBadge rating={item.rating} reviewCount={item.reviewCount} />}
      address={item.location?.address ? <AddressLabel address={item.location.address} /> : undefined}
      owner={item.owner ? <OwnerName name={item.owner.name} /> : undefined}
    />
  );
}
