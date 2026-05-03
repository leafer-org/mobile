import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useLikedStatus, useToggleLike } from '@/support/like';
import { Text } from '@/kernel/ui/text';

import { useItemDetail } from '../model/use-item-detail';
import { DetailActionsOverlay } from '../ui/detail-actions-overlay';
import { DetailCtaBar } from '../ui/detail-cta-bar';
import { BaseInfoWidget } from '../ui/widgets/base-info-widget';
import { ContactInfoWidget } from '../ui/widgets/contact-info-widget';
import { LocationWidget } from '../ui/widgets/location-widget';
import { OwnerWidget } from '../ui/widgets/owner-widget';
import { PaymentWidget } from '../ui/widgets/payment-widget';
import { ReviewWidget } from '../ui/widgets/review-widget';
import { ScheduleWidget } from '../ui/widgets/schedule-widget';
import { TeamWidget } from '../ui/widgets/team-widget';

type PaymentOption = {
  name: string;
  description?: string | null;
  strategy: string;
  price?: number | null;
};

export function ItemDetailScreen({ itemId }: { itemId: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useItemDetail(itemId);
  const likedStatus = useLikedStatus(data ? [itemId] : []);
  const isLiked = likedStatus.data?.has(itemId) ?? false;
  const { toggle } = useToggleLike(itemId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
        <ActivityIndicator size="large" color={'#a8a29e'} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900 px-6">
        <Text variant="h3">Товар не найден</Text>
      </View>
    );
  }

  const widgets = data.widgets as Array<Record<string, unknown>>;
  const ownerWidget = widgets.find((w) => w.type === 'owner');
  const ownerName = (ownerWidget?.name as string | undefined) ?? undefined;
  const baseInfoWidget = widgets.find((w) => w.type === 'base-info');
  const titleForShare = baseInfoWidget?.title as string | undefined;

  const paymentWidget = widgets.find((w) => w.type === 'payment');
  const cta = computeCta(paymentWidget?.options as PaymentOption[] | undefined);

  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View className="gap-6 pb-4">
          {widgets.map((widget, i) => (
            <WidgetRenderer key={i} widget={widget} eyebrow={widget.type === 'base-info' ? ownerName : undefined} />
          ))}
        </View>
      </ScrollView>
      <DetailActionsOverlay
        onBackPress={() => router.back()}
        isLiked={isLiked}
        onLikePress={() => toggle(isLiked)}
        shareTitle={titleForShare}
      />
      <DetailCtaBar
        priceLabel={cta.priceLabel}
        priceCaption={cta.priceCaption}
        ctaLabel="Записаться"
        onCtaPress={() => {}}
      />
    </View>
  );
}

type CtaInfo = { priceLabel: string | null; priceCaption: string | null };

function computeCta(options: PaymentOption[] | undefined): CtaInfo {
  if (!options || options.length === 0) {
    return { priceLabel: null, priceCaption: null };
  }
  const free = options.find((o) => o.strategy === 'free');
  const paid = options.filter((o) => o.price != null && o.price > 0);
  if (paid.length === 0 && free) {
    return { priceLabel: 'Бесплатно', priceCaption: null };
  }
  if (paid.length === 0) {
    return { priceLabel: null, priceCaption: null };
  }
  const min = Math.min(...paid.map((o) => o.price as number));
  const hasSub = options.some((o) => o.strategy === 'subscription');
  const suffix = hasSub ? ' / мес' : '';
  const prefix = paid.length > 1 || free ? 'от ' : '';
  return {
    priceLabel: `${prefix}${min.toLocaleString('ru-RU')} ₽${suffix}`,
    priceCaption: free ? 'есть бесплатное пробное' : null,
  };
}

function WidgetRenderer({
  widget,
  eyebrow,
}: {
  widget: Record<string, unknown>;
  eyebrow?: string;
}) {
  const type = widget.type as string;

  switch (type) {
    case 'base-info':
      return (
        <BaseInfoWidget
          title={widget.title as string}
          description={widget.description as string}
          media={(widget.media as []) ?? []}
          eyebrow={eyebrow}
        />
      );
    case 'payment':
      return <PaymentWidget options={(widget.options as []) ?? []} />;
    case 'owner':
      return (
        <OwnerWidget
          name={widget.name as string}
          avatarUrl={widget.avatarUrl as string | null}
        />
      );
    case 'item-review':
      return (
        <ReviewWidget
          label="отзывов"
          rating={widget.rating as number | null}
          reviewCount={widget.reviewCount as number}
        />
      );
    case 'owner-review':
      return (
        <ReviewWidget
          label="отзывов об организации"
          rating={widget.rating as number | null}
          reviewCount={widget.reviewCount as number}
        />
      );
    case 'location':
      return <LocationWidget address={widget.address as string | null} />;
    case 'schedule':
      return <ScheduleWidget entries={(widget.entries as []) ?? []} />;
    case 'contact-info':
      return <ContactInfoWidget contacts={(widget.contacts as []) ?? []} />;
    case 'team':
      return <TeamWidget title={widget.title as string} members={(widget.members as []) ?? []} />;
    default:
      return null;
  }
}
